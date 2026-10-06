from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from accounts.models import User
from books.models import Book
from chapels.models import Chapel
from conventions.models import ChoirSong, Convention, ConventionRegistration
from donations.models import Donation
from evangelization.models import EvangelizationEvent
from sermons.models import Sermon
from testimonies.models import Testimony
from churches.models import ContactMessage


class UserSummarySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    fullName = serializers.CharField(source="full_name", read_only=True)
    systemRole = serializers.CharField(source="system_role", read_only=True)
    soulStatus = serializers.CharField(source="church_status", read_only=True)
    chapelId = serializers.CharField(source="chapel_id", read_only=True, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "fullName", "email", "systemRole", "soulStatus", "chapelId"]


class RegistrationSerializer(serializers.Serializer):
    fullName = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30)
    country = serializers.CharField(max_length=100)
    city = serializers.CharField(max_length=150)
    churchStatus = serializers.ChoiceField(choices=User.ChurchStatus.choices)
    chapelSlug = serializers.SlugField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Un compte utilise déjà cette adresse e-mail.")
        return value

    def create(self, validated_data):
        chapel_slug = validated_data.pop("chapelSlug", "")
        password = validated_data.pop("password")
        chapel = Chapel.objects.filter(slug=chapel_slug, is_active=True).first() if chapel_slug else None
        return User.objects.create_user(
            email=validated_data["email"],
            password=password,
            full_name=validated_data["fullName"],
            phone=validated_data["phone"],
            country=validated_data["country"],
            city=validated_data["city"],
            church_status=validated_data["churchStatus"],
            chapel=chapel,
        )


class ChapelSerializer(serializers.ModelSerializer):
    pastorName = serializers.SerializerMethodField()
    contact = serializers.CharField(source="phone", read_only=True)

    class Meta:
        model = Chapel
        fields = ["slug", "name", "country", "city", "pastorName", "contact"]

    def get_pastorName(self, obj):
        return obj.pastor.full_name if obj.pastor else ""


class SermonSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    chapelSlug = serializers.CharField(source="chapel.slug", read_only=True, allow_null=True)
    chapelName = serializers.CharField(source="chapel.name", read_only=True, allow_null=True)
    preacher = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source="preaching_date", read_only=True)
    format = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = ["id", "title", "chapelSlug", "chapelName", "preacher", "date", "format"]

    def get_preacher(self, obj):
        return obj.preacher.full_name if obj.preacher else ""

    def get_format(self, obj):
        return "video" if obj.video else "audio"


class TestimonySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    authorName = serializers.SerializerMethodField()
    chapelName = serializers.CharField(source="chapel.name", read_only=True, allow_null=True)
    format = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Testimony
        fields = ["id", "authorName", "chapelName", "format", "excerpt", "content", "date"]

    def get_authorName(self, obj):
        if obj.is_anonymous:
            return "Anonyme"
        return obj.author.full_name if obj.author else obj.title.removeprefix("Témoignage de ")

    def get_format(self, obj):
        return {"TEXT": "texte", "AUDIO": "audio", "VIDEO": "video"}.get(obj.media_type, "texte")

    def get_excerpt(self, obj):
        return obj.content[:180]


class TestimonyCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, max_length=255)
    chapel = serializers.CharField(write_only=True, required=False, allow_blank=True)
    format = serializers.ChoiceField(choices=["texte", "audio", "video"], write_only=True)
    file = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Testimony
        fields = ["name", "chapel", "format", "content", "file"]

    def validate(self, attrs):
        media_format = attrs["format"]
        upload = attrs.get("file")
        if media_format == "texte" and not attrs.get("content", "").strip():
            raise serializers.ValidationError({"content": "Le témoignage écrit est obligatoire."})
        if media_format in {"audio", "video"} and not upload:
            raise serializers.ValidationError({"file": "Un fichier est requis pour ce format."})
        if upload and upload.size > 50 * 1024 * 1024:
            raise serializers.ValidationError({"file": "Le fichier ne peut pas dépasser 50 Mo."})
        if upload and media_format == "audio" and upload.name.rsplit(".", 1)[-1].lower() not in {"mp3", "m4a", "wav"}:
            raise serializers.ValidationError({"file": "Formats audio autorisés : MP3, M4A, WAV."})
        if upload and media_format == "video" and upload.name.rsplit(".", 1)[-1].lower() not in {"mp4", "mov"}:
            raise serializers.ValidationError({"file": "Formats vidéo autorisés : MP4, MOV."})
        return attrs

    def create(self, validated_data):
        from chapels.models import Chapel

        name = validated_data.pop("name")
        chapel_name = validated_data.pop("chapel", "")
        media_format = validated_data.pop("format")
        upload = validated_data.pop("file", None)
        chapel = Chapel.objects.filter(name__iexact=chapel_name).first() if chapel_name else None
        instance = Testimony.objects.create(
            author=self.context["request"].user if self.context["request"].user.is_authenticated else None,
            chapel=chapel,
            title=f"Témoignage de {name}",
            content=validated_data.get("content", ""),
            media_type={"texte": "TEXT", "audio": "AUDIO", "video": "VIDEO"}[media_format],
            status=Testimony.Status.PENDING,
        )
        if upload:
            setattr(instance, media_format, upload)
            instance.save(update_fields=[media_format])
        return instance


class ConventionSerializer(serializers.ModelSerializer):
    year = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    startDate = serializers.DateTimeField(source="start_date", read_only=True)
    endDate = serializers.DateTimeField(source="end_date", read_only=True)
    program = serializers.JSONField(read_only=True)

    class Meta:
        model = Convention
        fields = ["slug", "title", "year", "status", "location", "startDate", "endDate", "program"]

    def get_year(self, obj):
        return obj.start_date.year

    def get_status(self, obj):
        return "ancienne" if obj.is_archived else "nouvelle"

class ConventionRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    chapel = serializers.CharField(max_length=180)
    phone = serializers.CharField(max_length=30)
    attendees = serializers.IntegerField(min_value=1, max_value=20, default=1)

    def create(self, validated_data):
        request = self.context["request"]
        return ConventionRegistration.objects.create(
            convention=self.context["convention"],
            member=request.user if request.user.is_authenticated else None,
            full_name=validated_data["name"],
            phone=validated_data["phone"],
            chapel_name=validated_data["chapel"],
            attendees=validated_data["attendees"],
        )


class ChoirSongSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    chapelName = serializers.SerializerMethodField()
    format = serializers.SerializerMethodField()
    lyricsExcerpt = serializers.CharField(source="lyrics", read_only=True)

    class Meta:
        model = ChoirSong
        fields = ["id", "title", "chapelName", "format", "lyricsExcerpt"]

    def get_chapelName(self, obj):
        return obj.choir.chapel.name if obj.choir.chapel else obj.choir.name

    def get_format(self, obj):
        return "video" if obj.video else "texte"


class BookSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Book
        fields = ["id", "title", "description"]


class CampaignSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    date = serializers.DateTimeField(source="start_date", read_only=True)

    class Meta:
        model = EvangelizationEvent
        fields = ["id", "title", "location", "date", "description"]


class ContactMessageSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(required=False, allow_blank=True, max_length=40)

    class Meta:
        model = ContactMessage
        fields = ["name", "email", "subject", "message"]


class DonationCreateSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=500)
    currency = serializers.ChoiceField(choices=["XAF"])

    class Meta:
        model = Donation
        fields = ["amount", "currency"]

    def create(self, validated_data):
        request = self.context["request"]
        return Donation.objects.create(
            **validated_data,
            donor=request.user if request.user.is_authenticated else None,
            payment_method=Donation.PaymentMethod.OTHER,
            status=Donation.Status.PENDING,
        )