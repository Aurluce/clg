from django.contrib.auth.password_validation import validate_password
from django.utils.text import slugify
from rest_framework import serializers

from accounts.models import User
from books.models import Book
from chapels.models import Chapel, ChapelActivity
from conventions.models import ChoirSong, Convention, ConventionRegistration
from donations.models import Donation
from evangelization.models import EvangelizationEvent
from sermons.models import Sermon
from testimonies.models import Testimony, TestimonyComment
from churches.models import ChurchPageContent, ContactMessage


class UserSummarySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    fullName = serializers.CharField(source="full_name", read_only=True)
    systemRole = serializers.CharField(source="system_role", read_only=True)
    soulStatus = serializers.CharField(source="church_status", read_only=True)
    chapelId = serializers.CharField(source="chapel_id", read_only=True, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "fullName", "email", "systemRole", "soulStatus", "chapelId"]


class BlankAsNullSlugRelatedField(serializers.SlugRelatedField):
    def to_internal_value(self, data):
        if data == "":
            return None
        return super().to_internal_value(data)


class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    fullName = serializers.CharField(source="full_name", max_length=255)
    systemRole = serializers.CharField(source="system_role", read_only=True)
    soulStatus = serializers.CharField(source="church_status", read_only=True)
    chapelId = serializers.CharField(source="chapel_id", read_only=True, allow_null=True)
    chapelName = serializers.CharField(source="chapel.name", read_only=True, allow_null=True)
    chapelSlug = BlankAsNullSlugRelatedField(
        source="chapel",
        slug_field="slug",
        queryset=Chapel.objects.filter(is_active=True),
        required=False,
        allow_null=True,
    )
    profilePhoto = serializers.SerializerMethodField()
    profilePhotoUpload = serializers.ImageField(source="profile_photo", required=False, allow_null=True, write_only=True)
    removeProfilePhoto = serializers.BooleanField(required=False, write_only=True, default=False)
    isVerified = serializers.BooleanField(source="is_verified", read_only=True)
    isApproved = serializers.BooleanField(source="is_approved", read_only=True)
    dateJoined = serializers.DateTimeField(source="date_joined", read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "fullName", "email", "phone", "country", "city",
            "systemRole", "soulStatus", "chapelId", "chapelName", "chapelSlug",
            "profilePhoto", "profilePhotoUpload", "removeProfilePhoto",
            "isVerified", "isApproved", "dateJoined",
        ]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Un compte utilise déjà cette adresse e-mail.")
        return value

    def validate_profilePhotoUpload(self, value):
        if value and value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("La photo ne peut pas dépasser 5 Mo.")
        return value

    def get_profilePhoto(self, obj):
        if not obj.profile_photo:
            return None
        if not obj.profile_photo.storage.exists(obj.profile_photo.name):
            return None
        request = self.context.get("request")
        photo_url = obj.profile_photo.url
        return request.build_absolute_uri(photo_url) if request else photo_url

    def update(self, instance, validated_data):
        remove_photo = validated_data.pop("removeProfilePhoto", False)
        old_photo_name = instance.profile_photo.name if instance.profile_photo else None
        old_photo_storage = instance.profile_photo.storage if instance.profile_photo else None

        if remove_photo and "profile_photo" not in validated_data:
            instance.profile_photo = None

        instance = super().update(instance, validated_data)
        new_photo_name = instance.profile_photo.name if instance.profile_photo else None
        if old_photo_name and old_photo_storage and new_photo_name != old_photo_name:
            old_photo_storage.delete(old_photo_name)
        return instance


class PastorMemberSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    fullName = serializers.CharField(source="full_name", max_length=255)
    churchStatus = serializers.ChoiceField(source="church_status", choices=User.ChurchStatus.choices)
    chapelId = serializers.CharField(source="chapel_id", read_only=True, allow_null=True)
    chapelName = serializers.CharField(source="chapel.name", read_only=True, allow_null=True)
    dateJoined = serializers.DateTimeField(source="date_joined", read_only=True)
    isActive = serializers.BooleanField(source="is_active", required=False)
    isVerified = serializers.BooleanField(source="is_verified", required=False)
    isApproved = serializers.BooleanField(source="is_approved", required=False)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = [
            "id", "fullName", "email", "phone", "country", "city", "churchStatus",
            "chapelId", "chapelName", "dateJoined", "isActive", "isVerified",
            "isApproved", "password",
        ]

    def validate_email(self, value):
        queryset = User.objects.filter(email__iexact=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Un compte utilise déjà cette adresse e-mail.")
        return value

    def validate_password(self, value):
        if not self.instance or value:
            validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(
            email=validated_data.pop("email"),
            password=password,
            system_role=User.SystemRole.MEMBER,
            chapel=self.context["chapel"],
            **validated_data,
        )

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class PastorActivitySerializer(serializers.ModelSerializer):
    chapelName = serializers.CharField(source="chapel.name", read_only=True)

    class Meta:
        model = ChapelActivity
        fields = ["id", "title", "description", "date", "location", "chapelName", "created_at"]
        read_only_fields = ["id", "chapelName", "created_at"]


class PastorSermonSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    content = serializers.CharField(required=False, allow_blank=True)
    chapelSlug = serializers.SlugField(required=False)
    preacherId = serializers.IntegerField(required=False)
    date = serializers.DateTimeField(source="preaching_date", required=False)
    mediaType = serializers.ChoiceField(choices=["TEXT", "AUDIO", "VIDEO"], required=False)
    videoFile = serializers.FileField(required=False, write_only=True)
    audioFile = serializers.FileField(required=False, write_only=True)
    thumbnailFile = serializers.ImageField(required=False, write_only=True)
    removeThumbnail = serializers.BooleanField(required=False, write_only=True, default=False)
    removeMedia = serializers.BooleanField(required=False, write_only=True, default=False)
    isPublished = serializers.BooleanField(source="is_published", required=False)

    def validate(self, attrs):
        instance = self.instance
        if instance is None and "preaching_date" not in attrs:
            raise serializers.ValidationError({"date": "La date de prédication est obligatoire."})
        chapel_slug = attrs.get("chapelSlug")
        chapel = Chapel.objects.filter(slug=chapel_slug, is_active=True).first() if chapel_slug else (instance.chapel if instance else None)
        if chapel is None:
            raise serializers.ValidationError({"chapelSlug": "Sélectionnez une chapelle active."})

        request = self.context["request"]
        allowed_chapel = self.context.get("managed_chapel")
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN and chapel.pk != getattr(allowed_chapel, "pk", None):
            raise serializers.ValidationError({"chapelSlug": "Vous ne pouvez gérer que votre propre chapelle."})

        preacher_id = attrs.get("preacherId")
        preacher = User.objects.filter(pk=preacher_id, is_active=True).first() if preacher_id else (instance.preacher if instance else None)
        if preacher is None:
            raise serializers.ValidationError({"preacherId": "Sélectionnez un pasteur actif de cette chapelle."})
        preacher_is_in_chapel = (
            preacher.pk == chapel.pastor_id
            or (preacher.chapel_id == chapel.pk and preacher.church_status == User.ChurchStatus.PASTEUR)
            or (preacher.chapel_id == chapel.pk and preacher.system_role == User.SystemRole.PASTOR_ADMIN)
        )
        if not preacher_is_in_chapel:
            raise serializers.ValidationError({"preacherId": "Ce pasteur n’est pas associé à la chapelle sélectionnée."})

        media_type = attrs.get("mediaType") or self._existing_media_type(instance)
        video = attrs.get("videoFile")
        audio = attrs.get("audioFile")
        remove_media = attrs.get("removeMedia", False)
        if media_type == "VIDEO" and not (video or (instance and instance.video and not remove_media)):
            raise serializers.ValidationError({"videoFile": "Ajoutez un fichier vidéo pour cette prédication."})
        if media_type == "AUDIO" and not (audio or (instance and instance.audio and not remove_media)):
            raise serializers.ValidationError({"audioFile": "Ajoutez un fichier audio pour cette prédication."})
        if media_type == "TEXT" and not (attrs.get("content", instance.content if instance else "").strip()):
            raise serializers.ValidationError({"content": "Le texte intégral est obligatoire pour une prédication écrite."})
        if video and (video.size > 500 * 1024 * 1024 or video.name.rsplit(".", 1)[-1].lower() not in {"mp4", "mov", "webm"}):
            raise serializers.ValidationError({"videoFile": "Vidéo invalide. Formats acceptés : MP4, MOV, WEBM (500 Mo max)."})
        if audio and (audio.size > 100 * 1024 * 1024 or audio.name.rsplit(".", 1)[-1].lower() not in {"mp3", "m4a", "wav", "ogg"}):
            raise serializers.ValidationError({"audioFile": "Audio invalide. Formats acceptés : MP3, M4A, WAV, OGG (100 Mo max)."})
        thumbnail = attrs.get("thumbnailFile")
        if thumbnail and thumbnail.size > 10 * 1024 * 1024:
            raise serializers.ValidationError({"thumbnailFile": "L’image de couverture ne peut pas dépasser 10 Mo."})

        attrs["chapel"] = chapel
        attrs["preacher"] = preacher
        attrs["mediaType"] = media_type
        return attrs

    @staticmethod
    def _existing_media_type(instance):
        if instance and instance.video:
            return "VIDEO"
        if instance and instance.audio:
            return "AUDIO"
        return "TEXT"

    def _make_slug(self, title, instance=None):
        base_slug = slugify(title) or "predication"
        slug = base_slug
        suffix = 2
        queryset = Sermon.objects.exclude(pk=instance.pk) if instance else Sermon.objects.all()
        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        return slug

    def create(self, validated_data):
        validated_data.pop("chapelSlug", None)
        validated_data.pop("preacherId", None)
        chapel = validated_data.pop("chapel")
        preacher = validated_data.pop("preacher")
        media_type = validated_data.pop("mediaType")
        video = validated_data.pop("videoFile", None)
        audio = validated_data.pop("audioFile", None)
        thumbnail = validated_data.pop("thumbnailFile", None)
        validated_data.pop("removeThumbnail", None)
        validated_data.pop("removeMedia", None)
        slug = self._make_slug(validated_data["title"])
        if media_type != "VIDEO":
            video = None
        if media_type != "AUDIO":
            audio = None
        return Sermon.objects.create(
            **validated_data,
            slug=slug,
            chapel=chapel,
            preacher=preacher,
            video=video,
            audio=audio,
            thumbnail=thumbnail,
        )

    def update(self, instance, validated_data):
        validated_data.pop("chapelSlug", None)
        validated_data.pop("preacherId", None)
        old_video = instance.video
        old_audio = instance.audio
        old_thumbnail = instance.thumbnail
        chapel = validated_data.pop("chapel", instance.chapel)
        preacher = validated_data.pop("preacher", instance.preacher)
        media_type = validated_data.pop("mediaType", self._existing_media_type(instance))
        video = validated_data.pop("videoFile", None)
        audio = validated_data.pop("audioFile", None)
        thumbnail = validated_data.pop("thumbnailFile", None)
        remove_thumbnail = validated_data.pop("removeThumbnail", False)
        remove_media = validated_data.pop("removeMedia", False)
        if "title" in validated_data:
            instance.slug = self._make_slug(validated_data["title"], instance)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.chapel = chapel
        instance.preacher = preacher
        if media_type == "VIDEO":
            if video:
                instance.video = video
            elif remove_media:
                instance.video = None
            instance.audio = None
        elif media_type == "AUDIO":
            if audio:
                instance.audio = audio
            elif remove_media:
                instance.audio = None
            instance.video = None
        else:
            instance.video = None
            instance.audio = None
        if thumbnail:
            instance.thumbnail = thumbnail
        elif remove_thumbnail:
            instance.thumbnail = None
        instance.save()
        for old_file, new_file in (
            (old_video, instance.video),
            (old_audio, instance.audio),
            (old_thumbnail, instance.thumbnail),
        ):
            if old_file and old_file.name != getattr(new_file, "name", None):
                old_file.delete(save=False)
        return instance

    def to_representation(self, instance):
        data = SermonSerializer(instance, context=self.context).data
        data["preacherId"] = instance.preacher_id
        data["isPublished"] = instance.is_published
        data["mediaType"] = self._existing_media_type(instance)
        return data


class PastorChoiceSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source="full_name", read_only=True)
    churchStatus = serializers.CharField(source="church_status", read_only=True)
    systemRole = serializers.CharField(source="system_role", read_only=True)

    class Meta:
        model = User
        fields = ["id", "fullName", "email", "churchStatus", "systemRole"]


class PasswordChangeSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(write_only=True, trim_whitespace=False)
    newPassword = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_currentPassword(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Le mot de passe actuel est incorrect.")
        return value

    def validate_newPassword(self, value):
        validate_password(value, user=self.context["request"].user)
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["newPassword"])
        user.save(update_fields=["password"])
        return user


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
    id = serializers.CharField(read_only=True)
    pastorName = serializers.SerializerMethodField()
    contact = serializers.CharField(source="phone", read_only=True)

    class Meta:
        model = Chapel
        fields = [
            "id", "slug", "name", "country", "region", "city", "address",
            "latitude", "longitude", "pastorName", "contact",
        ]

    def get_pastorName(self, obj):
        return obj.pastor.full_name if obj.pastor else ""


class ChapelActivitySerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(read_only=True)
    imageUrl = serializers.SerializerMethodField()

    class Meta:
        model = ChapelActivity
        fields = ["id", "title", "description", "date", "location", "imageUrl"]

    def get_imageUrl(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class MemberChapelSerializer(serializers.ModelSerializer):
    pastorName = serializers.CharField(source="pastor.full_name", read_only=True, allow_null=True)
    memberCount = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()
    sermons = serializers.SerializerMethodField()
    events = serializers.SerializerMethodField()
    testimonies = serializers.SerializerMethodField()

    class Meta:
        model = Chapel
        fields = [
            "name", "slug", "country", "region", "city", "address", "latitude", "longitude",
            "phone", "email", "description", "pastorName", "memberCount",
            "activities", "sermons", "events", "testimonies",
        ]

    def get_memberCount(self, obj):
        return obj.members.filter(is_active=True).count()

    def get_activities(self, obj):
        activities = obj.activities.order_by("-date")[:8]
        return ChapelActivitySerializer(activities, many=True, context=self.context).data

    def get_sermons(self, obj):
        sermons = Sermon.objects.filter(chapel=obj, is_published=True).select_related("chapel", "preacher")[:6]
        return SermonSerializer(sermons, many=True, context=self.context).data

    def get_events(self, obj):
        events = EvangelizationEvent.objects.filter(chapel=obj, is_published=True).order_by("-start_date")[:6]
        return CampaignSerializer(events, many=True, context=self.context).data

    def get_testimonies(self, obj):
        testimonies = Testimony.objects.filter(
            chapel=obj,
            status=Testimony.Status.APPROVED,
        ).select_related("author", "chapel")[:6]
        return TestimonySerializer(testimonies, many=True, context=self.context).data


class SermonSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    slug = serializers.SlugField(read_only=True)
    chapelSlug = serializers.CharField(source="chapel.slug", read_only=True, allow_null=True)
    chapelName = serializers.CharField(source="chapel.name", read_only=True, allow_null=True)
    preacher = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source="preaching_date", read_only=True)
    format = serializers.SerializerMethodField()
    videoUrl = serializers.SerializerMethodField()
    audioUrl = serializers.SerializerMethodField()
    thumbnailUrl = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = [
            "id", "slug", "title", "description", "content", "chapelSlug", "chapelName",
            "preacher", "date", "format", "videoUrl", "audioUrl", "thumbnailUrl",
        ]

    def get_preacher(self, obj):
        return obj.preacher.full_name if obj.preacher else ""

    def get_format(self, obj):
        if obj.video:
            return "video"
        if obj.audio:
            return "audio"
        return "texte"

    def _file_url(self, file_field):
        if not file_field:
            return None
        try:
            if not file_field.storage.exists(file_field.name):
                return None
            url = file_field.url
        except (OSError, ValueError):
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url

    def get_videoUrl(self, obj):
        return self._file_url(obj.video)

    def get_audioUrl(self, obj):
        return self._file_url(obj.audio)

    def get_thumbnailUrl(self, obj):
        return self._file_url(obj.thumbnail)


class TestimonySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(read_only=True)
    authorName = serializers.SerializerMethodField()
    chapelName = serializers.CharField(source="chapel.name", read_only=True, allow_null=True)
    chapelSlug = serializers.CharField(source="chapel.slug", read_only=True, allow_null=True)
    format = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source="created_at", read_only=True)
    audioUrl = serializers.SerializerMethodField()
    videoUrl = serializers.SerializerMethodField()
    commentCount = serializers.SerializerMethodField()

    class Meta:
        model = Testimony
        fields = [
            "id", "title", "authorName", "chapelName", "chapelSlug", "format",
            "excerpt", "content", "date", "audioUrl", "videoUrl", "commentCount",
        ]

    def get_authorName(self, obj):
        if obj.is_anonymous:
            return "Anonyme"
        return obj.author.full_name if obj.author else obj.title.removeprefix("Témoignage de ")

    def get_format(self, obj):
        return {"TEXT": "texte", "AUDIO": "audio", "VIDEO": "video"}.get(obj.media_type, "texte")

    def get_excerpt(self, obj):
        return obj.content[:180]

    def get_audioUrl(self, obj):
        return self._file_url(obj.audio)

    def get_videoUrl(self, obj):
        return self._file_url(obj.video)

    def get_commentCount(self, obj):
        return obj.comments.filter(is_approved=True).count()

    def _file_url(self, file_field):
        if not file_field:
            return None
        try:
            if not file_field.storage.exists(file_field.name):
                return None
            url = file_field.url
        except (OSError, ValueError):
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(url) if request else url


class TestimonyCreateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, max_length=255, required=False, allow_blank=True)
    chapel = serializers.CharField(write_only=True, required=False, allow_blank=True)
    format = serializers.ChoiceField(choices=["texte", "audio", "video"], write_only=True)
    file = serializers.FileField(write_only=True, required=False)
    isAnonymous = serializers.BooleanField(write_only=True, required=False, default=False)

    class Meta:
        model = Testimony
        fields = ["name", "chapel", "format", "content", "file", "isAnonymous"]

    def validate(self, attrs):
        media_format = attrs["format"]
        if not attrs.get("isAnonymous", False) and not attrs.get("name", "").strip():
            raise serializers.ValidationError({"name": "Indiquez votre nom ou choisissez la publication anonyme."})
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
        if upload and media_format == "audio" and not (upload.content_type or "").startswith("audio/"):
            raise serializers.ValidationError({"file": "Le fichier sélectionné n'est pas un audio valide."})
        if upload and media_format == "video" and not (upload.content_type or "").startswith("video/"):
            raise serializers.ValidationError({"file": "Le fichier sélectionné n'est pas une vidéo valide."})
        return attrs

    def create(self, validated_data):
        from chapels.models import Chapel

        name = validated_data.pop("name", "")
        chapel_name = validated_data.pop("chapel", "")
        media_format = validated_data.pop("format")
        upload = validated_data.pop("file", None)
        is_anonymous = validated_data.pop("isAnonymous", False)
        chapel = Chapel.objects.filter(name__iexact=chapel_name).first() if chapel_name else None
        instance = Testimony.objects.create(
            author=(self.context["request"].user if self.context["request"].user.is_authenticated and not is_anonymous else None),
            chapel=chapel,
            title="Témoignage anonyme" if is_anonymous else f"Témoignage de {name}",
            content=validated_data.get("content", ""),
            media_type={"texte": "TEXT", "audio": "AUDIO", "video": "VIDEO"}[media_format],
            status=Testimony.Status.PENDING,
            is_anonymous=is_anonymous,
        )
        if upload:
            setattr(instance, media_format, upload)
            instance.save(update_fields=[media_format])
        return instance


class TestimonyCommentSerializer(serializers.ModelSerializer):
    authorName = serializers.CharField(source="author.full_name", read_only=True, allow_null=True)
    date = serializers.DateTimeField(source="created_at", read_only=True)
    content = serializers.CharField(max_length=1000, trim_whitespace=True)

    class Meta:
        model = TestimonyComment
        fields = ["id", "authorName", "content", "date"]
        read_only_fields = ["id", "authorName", "date"]

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Le commentaire ne peut pas être vide.")
        return value.strip()

    def create(self, validated_data):
        return TestimonyComment.objects.create(
            **validated_data,
            testimony=self.context["testimony"],
            author=self.context["request"].user,
            is_approved=False,
        )


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


class ChurchPageContentSerializer(serializers.ModelSerializer):
    scriptureReference = serializers.CharField(source="scripture_reference", read_only=True)
    heroTitle = serializers.CharField(source="hero_title", read_only=True)
    heroSubtitle = serializers.CharField(source="hero_subtitle", read_only=True)
    scriptureQuote = serializers.CharField(source="scripture_quote", read_only=True)
    objectivesIntro = serializers.CharField(source="objectives_intro", read_only=True)
    shortTermObjective = serializers.CharField(source="short_term_objective", read_only=True)
    mediumTermObjective = serializers.CharField(source="medium_term_objective", read_only=True)
    longTermObjective = serializers.CharField(source="long_term_objective", read_only=True)
    ctaEyebrow = serializers.CharField(source="cta_eyebrow", read_only=True)
    ctaTitle = serializers.CharField(source="cta_title", read_only=True)
    ctaText = serializers.CharField(source="cta_text", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = ChurchPageContent
        fields = [
            "scriptureReference", "heroTitle", "heroSubtitle", "scriptureQuote",
            "genesis", "vision", "objectivesIntro", "shortTermObjective",
            "mediumTermObjective", "longTermObjective", "ctaEyebrow", "ctaTitle",
            "ctaText", "updatedAt",
        ]


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