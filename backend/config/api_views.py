from django.db import connection
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.models import User
from books.models import Book
from chapels.models import Chapel
from conventions.models import ChoirSong, Convention
from donations.models import Donation
from evangelization.models import EvangelizationEvent
from sermons.models import Sermon
from testimonies.models import Testimony
from churches.models import ContactMessage

from .api_serializers import (
    BookSerializer,
    CampaignSerializer,
    ChapelSerializer,
    ChoirSongSerializer,
    ContactMessageSerializer,
    ConventionRegistrationSerializer,
    ConventionSerializer,
    DonationCreateSerializer,
    RegistrationSerializer,
    SermonSerializer,
    TestimonyCreateSerializer,
    TestimonySerializer,
    UserSummarySerializer,
)


class EmailTokenSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSummarySerializer(self.user).data
        return data


class EmailTokenView(TokenObtainPairView):
    serializer_class = EmailTokenSerializer
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]


class RegisterView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"user": UserSummarySerializer(user).data, "message": "Compte créé avec succès."},
            status=status.HTTP_201_CREATED,
        )


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSummarySerializer(request.user).data)


class ChapelListView(generics.ListAPIView):
    serializer_class = ChapelSerializer
    queryset = Chapel.objects.filter(is_active=True).select_related("pastor")


class SermonListView(generics.ListAPIView):
    serializer_class = SermonSerializer
    queryset = Sermon.objects.filter(is_published=True).select_related("chapel", "preacher")


class TestimonyListCreateView(generics.ListCreateAPIView):
    queryset = Testimony.objects.filter(status=Testimony.Status.APPROVED).select_related("author", "chapel")
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_serializer_class(self):
        return TestimonyCreateSerializer if self.request.method == "POST" else TestimonySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Témoignage soumis pour validation."}, status=status.HTTP_201_CREATED)


class ConventionListView(generics.ListAPIView):
    serializer_class = ConventionSerializer
    queryset = Convention.objects.filter(is_published=True).order_by("-start_date")


class ConventionRegistrationView(generics.CreateAPIView):
    serializer_class = ConventionRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["convention"] = get_object_or_404(Convention, slug=self.kwargs["slug"], is_published=True)
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Inscription enregistrée."}, status=status.HTTP_201_CREATED)


class ChoirSongListView(generics.ListAPIView):
    serializer_class = ChoirSongSerializer

    def get_queryset(self):
        return ChoirSong.objects.filter(choir__convention__slug=self.kwargs["slug"], choir__convention__is_published=True).select_related("choir", "choir__chapel")


class BookListView(generics.ListAPIView):
    serializer_class = BookSerializer
    queryset = Book.objects.filter(is_published=True)


class CampaignListView(generics.ListAPIView):
    serializer_class = CampaignSerializer
    queryset = EvangelizationEvent.objects.filter(is_published=True)


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Message envoyé."}, status=status.HTTP_201_CREATED)


class DonationCreateView(generics.CreateAPIView):
    serializer_class = DonationCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Intention de don enregistrée. Le prestataire de paiement reste à configurer."},
            status=status.HTTP_201_CREATED,
        )


class HealthView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
        except Exception:
            return Response({"status": "error", "database": "unavailable"}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response({"status": "ok", "database": "ok"})