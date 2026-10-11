from django.db import connection
from datetime import datetime, time, timedelta

from django.db.models import Q, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.models import User
from books.models import Book
from chapels.models import Chapel, ChapelActivity
from conventions.models import ChoirSong, Convention
from donations.models import Donation
from evangelization.models import EvangelizationEvent
from sermons.models import Sermon
from testimonies.models import Testimony, TestimonyComment
from churches.models import ChurchPageContent, ContactMessage

from .api_serializers import (
    BookSerializer,
    CampaignSerializer,
    ChapelSerializer,
    ChurchPageContentSerializer,
    ChoirSongSerializer,
    ContactMessageSerializer,
    ConventionRegistrationSerializer,
    ConventionSerializer,
    DonationCreateSerializer,
    MemberChapelSerializer,
    PastorActivitySerializer,
    PastorChoiceSerializer,
    PastorMemberSerializer,
    PastorSermonSerializer,
    PasswordChangeSerializer,
    RegistrationSerializer,
    SermonSerializer,
    TestimonyCommentSerializer,
    TestimonyCreateSerializer,
    TestimonySerializer,
    UserProfileSerializer,
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


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get(self, request):
        return Response(UserProfileSerializer(request.user, context={"request": request}).data)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserProfileSerializer(request.user, context={"request": request}).data)


class PastorManagementAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def has_manager_role(self, request):
        return request.user.system_role in {
            User.SystemRole.PASTOR_ADMIN,
            User.SystemRole.SUPER_ADMIN,
        }

    def managed_chapel(self, request, slug=None):
        user = request.user
        if user.system_role == User.SystemRole.PASTOR_ADMIN:
            chapel = user.pastored_chapels.filter(is_active=True).first()
            if chapel is None and user.chapel_id:
                chapel = Chapel.objects.filter(pk=user.chapel_id, is_active=True).filter(
                    Q(pastor=user) | Q(pastor__isnull=True)
                ).first()
            if chapel and slug and chapel.slug != slug:
                return None
            return chapel
        if user.system_role == User.SystemRole.SUPER_ADMIN and slug:
            return Chapel.objects.filter(slug=slug, is_active=True).first()
        return None

    def forbidden(self):
        return Response(
            {"detail": "Cette action est réservée aux administrateurs pastoraux et super-administrateurs."},
            status=status.HTTP_403_FORBIDDEN,
        )


class PastorMemberListCreateView(PastorManagementAPIView):
    def get(self, request):
        if not self.has_manager_role(request):
            return self.forbidden()
        members = User.objects.filter(system_role=User.SystemRole.MEMBER).select_related("chapel")
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN:
            chapel = self.managed_chapel(request)
            if chapel is None:
                return Response({"detail": "Aucune chapelle n’est associée à ce compte."}, status=status.HTTP_400_BAD_REQUEST)
            members = members.filter(chapel=chapel)
        return Response(PastorMemberSerializer(members, many=True).data)

    def post(self, request):
        if not self.has_manager_role(request):
            return self.forbidden()
        chapel = self.managed_chapel(request, request.data.get("chapelSlug"))
        if chapel is None:
            return Response({"chapelSlug": "Sélectionnez une chapelle autorisée."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = PastorMemberSerializer(data=request.data, context={"chapel": chapel})
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        return Response(PastorMemberSerializer(member).data, status=status.HTTP_201_CREATED)


class PastorMemberDetailView(PastorManagementAPIView):
    def get_object(self, request, member_id):
        queryset = User.objects.filter(system_role=User.SystemRole.MEMBER).select_related("chapel")
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN:
            chapel = self.managed_chapel(request)
            if chapel is None:
                return None
            queryset = queryset.filter(chapel=chapel)
        return queryset.filter(pk=member_id).first()

    def patch(self, request, member_id):
        if not self.has_manager_role(request):
            return self.forbidden()
        member = self.get_object(request, member_id)
        if member is None:
            return Response({"detail": "Membre introuvable dans votre périmètre."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PastorMemberSerializer(member, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        return Response(PastorMemberSerializer(member).data)

    def delete(self, request, member_id):
        if not self.has_manager_role(request):
            return self.forbidden()
        member = self.get_object(request, member_id)
        if member is None:
            return Response({"detail": "Membre introuvable dans votre périmètre."}, status=status.HTTP_404_NOT_FOUND)
        member.is_active = False
        member.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class PastorActivityListCreateView(PastorManagementAPIView):
    def get(self, request):
        if not self.has_manager_role(request):
            return self.forbidden()
        activities = ChapelActivity.objects.select_related("chapel")
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN:
            chapel = self.managed_chapel(request)
            if chapel is None:
                return Response({"detail": "Aucune chapelle n’est associée à ce compte."}, status=status.HTTP_400_BAD_REQUEST)
            activities = activities.filter(chapel=chapel)
        return Response(PastorActivitySerializer(activities, many=True).data)

    def post(self, request):
        if not self.has_manager_role(request):
            return self.forbidden()
        chapel = self.managed_chapel(request, request.data.get("chapelSlug"))
        if chapel is None:
            return Response({"chapelSlug": "Sélectionnez une chapelle autorisée."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = PastorActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        activity = serializer.save(chapel=chapel)
        return Response(PastorActivitySerializer(activity).data, status=status.HTTP_201_CREATED)


class PastorActivityDetailView(PastorManagementAPIView):
    def get_object(self, request, activity_id):
        queryset = ChapelActivity.objects.select_related("chapel")
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN:
            chapel = self.managed_chapel(request)
            if chapel is None:
                return None
            queryset = queryset.filter(chapel=chapel)
        return queryset.filter(pk=activity_id).first()

    def patch(self, request, activity_id):
        if not self.has_manager_role(request):
            return self.forbidden()
        activity = self.get_object(request, activity_id)
        if activity is None:
            return Response({"detail": "Activité introuvable dans votre périmètre."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PastorActivitySerializer(activity, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        return Response(PastorActivitySerializer(serializer.save()).data)

    def delete(self, request, activity_id):
        if not self.has_manager_role(request):
            return self.forbidden()
        activity = self.get_object(request, activity_id)
        if activity is None:
            return Response({"detail": "Activité introuvable dans votre périmètre."}, status=status.HTTP_404_NOT_FOUND)
        activity.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PastorDashboardOverviewView(PastorManagementAPIView):
    def get(self, request):
        if not self.has_manager_role(request):
            return self.forbidden()

        user = request.user
        chapel = self.managed_chapel(request)
        if user.system_role == User.SystemRole.PASTOR_ADMIN and chapel is None:
            return Response({"detail": "Aucune chapelle n’est associée à ce compte."}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.localtime()
        today = timezone.localdate()
        month_start = today.replace(day=1)
        previous_month_end = month_start - timedelta(days=1)
        previous_month_start = previous_month_end.replace(day=1)

        members = User.objects.filter(system_role=User.SystemRole.MEMBER)
        activities = ChapelActivity.objects.select_related("chapel")
        testimonies = Testimony.objects.all()
        sermons = Sermon.objects.filter(is_published=True)
        donations = Donation.objects.filter(status=Donation.Status.SUCCESS, currency="XAF")
        if chapel:
            members = members.filter(chapel=chapel)
            activities = activities.filter(chapel=chapel)
            testimonies = testimonies.filter(chapel=chapel)
            sermons = sermons.filter(chapel=chapel)
            donations = donations.filter(donor__chapel=chapel)

        members = members.filter(is_active=True)
        activities = activities.filter(chapel__is_active=True)
        testimonies = testimonies.filter(chapel__is_active=True)
        sermons = sermons.filter(chapel__is_active=True)

        sunday_days = (6 - today.weekday()) % 7 or 7
        next_sunday = today + timedelta(days=sunday_days)
        sunday_start = timezone.make_aware(datetime.combine(next_sunday, time.min))
        sunday_end = sunday_start + timedelta(days=1)
        sunday_activity = activities.filter(date__gte=sunday_start, date__lt=sunday_end).order_by("date").first()

        month_points = []
        for month_offset in range(5, -1, -1):
            month_index = today.month - 1 - month_offset
            year = today.year + month_index // 12
            month = month_index % 12 + 1
            period_start = today.replace(year=year, month=month, day=1)
            next_month_index = month + 1
            next_month_year = year
            if next_month_index == 13:
                next_month_index = 1
                next_month_year += 1
            period_end = today.replace(year=next_month_year, month=next_month_index, day=1) if next_month_index > 1 else today.replace(year=next_month_year, month=1, day=1)
            member_count = members.filter(date_joined__date__gte=period_start, date_joined__date__lt=period_end).count()
            donation_total = donations.filter(created_at__date__gte=period_start, created_at__date__lt=period_end).aggregate(total=Sum("amount"))["total"] or 0
            month_points.append({
                "month": period_start.strftime("%b"),
                "members": member_count,
                "donations": str(donation_total),
            })

        member_total = members.count()
        new_members = members.filter(date_joined__date__gte=month_start, date_joined__date__lte=today).count()
        previous_new_members = members.filter(date_joined__date__gte=previous_month_start, date_joined__date__lt=month_start).count()
        member_growth = round(((new_members - previous_new_members) / previous_new_members) * 100, 1) if previous_new_members else (100.0 if new_members else 0.0)
        donations_this_month = donations.filter(created_at__date__gte=month_start, created_at__date__lte=today)

        return Response({
            "pastor": {"fullName": user.full_name or user.email, "email": user.email},
            "chapel": {"name": chapel.name, "city": chapel.city, "country": chapel.country} if chapel else None,
            "stats": {
                "activeMembers": member_total,
                "newMembersThisMonth": new_members,
                "memberGrowthPercent": member_growth,
                "publishedSermons": sermons.count(),
                "pendingTestimonies": testimonies.filter(status=Testimony.Status.PENDING).count(),
                "upcomingActivities": activities.filter(date__gte=now).count(),
                "donationsThisMonth": str(donations_this_month.aggregate(total=Sum("amount"))["total"] or 0),
                "donationCountThisMonth": donations_this_month.count(),
            },
            "monthly": month_points,
            "nextSunday": {
                "date": next_sunday.isoformat(),
                "activity": PastorActivitySerializer(sunday_activity).data if sunday_activity else None,
            },
            "upcomingActivities": PastorActivitySerializer(
                activities.filter(date__gte=now).order_by("date")[:5], many=True
            ).data,
        })


class PastorSermonListCreateView(PastorManagementAPIView):
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_managed_chapel(self, request):
        chapel = self.managed_chapel(request)
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN and chapel is None:
            return None, Response({"detail": "Aucune chapelle n’est associée à ce compte."}, status=status.HTTP_400_BAD_REQUEST)
        return chapel, None

    def get(self, request):
        if not request.user.is_authenticated:
            return Response(SermonSerializer(Sermon.objects.filter(is_published=True).select_related("chapel", "preacher"), many=True, context={"request": request}).data)
        if not self.has_manager_role(request):
            return Response(SermonSerializer(Sermon.objects.filter(is_published=True).select_related("chapel", "preacher"), many=True, context={"request": request}).data)
        chapel, error = self.get_managed_chapel(request)
        if error:
            return error
        sermons = Sermon.objects.select_related("chapel", "preacher").order_by("-preaching_date")
        if chapel:
            sermons = sermons.filter(chapel=chapel)
        return Response([PastorSermonSerializer(item, context={"request": request}).data for item in sermons])

    def post(self, request):
        if not self.has_manager_role(request):
            return self.forbidden()
        chapel, error = self.get_managed_chapel(request)
        if error:
            return error
        serializer = PastorSermonSerializer(data=request.data, context={"request": request, "managed_chapel": chapel})
        serializer.is_valid(raise_exception=True)
        sermon = serializer.save()
        return Response(PastorSermonSerializer(sermon, context={"request": request}).data, status=status.HTTP_201_CREATED)


class PastorSermonOptionsView(PastorManagementAPIView):
    def get(self, request):
        if not self.has_manager_role(request):
            return self.forbidden()
        chapels = Chapel.objects.filter(is_active=True)
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN:
            chapel = self.managed_chapel(request)
            if chapel is None:
                return Response({"detail": "Aucune chapelle n’est associée à ce compte."}, status=status.HTTP_400_BAD_REQUEST)
            chapels = chapels.filter(pk=chapel.pk)
        return Response([
            {"id": chapel.pk, "slug": chapel.slug, "name": chapel.name, "city": chapel.city, "country": chapel.country}
            for chapel in chapels
        ])


class PastorChapelPreachersView(PastorManagementAPIView):
    def get(self, request, chapel_slug):
        if not self.has_manager_role(request):
            return self.forbidden()
        chapel = self.managed_chapel(request, chapel_slug)
        if chapel is None:
            return Response({"detail": "Chapelle introuvable dans votre périmètre."}, status=status.HTTP_404_NOT_FOUND)
        preachers = User.objects.filter(is_active=True).filter(
            Q(pk=chapel.pastor_id)
            | Q(chapel=chapel, church_status=User.ChurchStatus.PASTEUR)
            | Q(chapel=chapel, system_role=User.SystemRole.PASTOR_ADMIN)
        ).distinct().order_by("full_name")
        return Response(PastorChoiceSerializer(preachers, many=True).data)


class PastorSermonDetailView(PastorManagementAPIView):
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_object(self, request, sermon_id):
        sermons = Sermon.objects.select_related("chapel", "preacher")
        if not request.user.is_authenticated:
            return sermons.filter(pk=sermon_id, is_published=True).first()
        if not self.has_manager_role(request):
            return sermons.filter(pk=sermon_id, is_published=True).first()
        chapel = self.managed_chapel(request)
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN:
            if chapel is None:
                return None
            sermons = sermons.filter(chapel=chapel)
        return sermons.filter(pk=sermon_id).first()

    def get(self, request, sermon_id):
        sermon = self.get_object(request, sermon_id)
        if sermon is None:
            return Response({"detail": "Prédication introuvable."}, status=status.HTTP_404_NOT_FOUND)
        return Response(PastorSermonSerializer(sermon, context={"request": request}).data)

    def patch(self, request, sermon_id):
        if not self.has_manager_role(request):
            return self.forbidden()
        sermon = self.get_object(request, sermon_id)
        if sermon is None:
            return Response({"detail": "Prédication introuvable dans votre périmètre."}, status=status.HTTP_404_NOT_FOUND)
        serializer = PastorSermonSerializer(
            sermon,
            data=request.data,
            partial=True,
            context={"request": request, "managed_chapel": self.managed_chapel(request)},
        )
        serializer.is_valid(raise_exception=True)
        sermon = serializer.save()
        return Response(PastorSermonSerializer(sermon, context={"request": request}).data)

    def delete(self, request, sermon_id):
        if not self.has_manager_role(request):
            return self.forbidden()
        sermon = self.get_object(request, sermon_id)
        if sermon is None:
            return Response({"detail": "Prédication introuvable dans votre périmètre."}, status=status.HTTP_404_NOT_FOUND)
        sermon.video.delete(save=False)
        sermon.audio.delete(save=False)
        sermon.thumbnail.delete(save=False)
        sermon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PastorTestimonyListView(PastorManagementAPIView):
    def get(self, request):
        if not self.has_manager_role(request):
            return self.forbidden()
        testimonies = Testimony.objects.select_related("chapel", "author")
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN:
            chapel = self.managed_chapel(request)
            if chapel is None:
                return Response({"detail": "Aucune chapelle n’est associée à ce compte."}, status=status.HTTP_400_BAD_REQUEST)
            testimonies = testimonies.filter(chapel=chapel)
        return Response([
            {
                "id": item.pk,
                "title": item.title,
                "authorName": "Anonyme" if item.is_anonymous else (item.author.full_name if item.author else item.title),
                "status": item.status,
                "createdAt": item.created_at,
                "content": item.content,
            }
            for item in testimonies
        ])

    def patch(self, request, identifier=None):
        if not self.has_manager_role(request):
            return self.forbidden()
        queryset = Testimony.objects.all()
        if request.user.system_role == User.SystemRole.PASTOR_ADMIN:
            chapel = self.managed_chapel(request)
            if chapel is None:
                return Response({"detail": "Aucune chapelle n’est associée à ce compte."}, status=status.HTTP_400_BAD_REQUEST)
            queryset = queryset.filter(chapel=chapel)
        testimony = queryset.filter(pk=identifier).first()
        if testimony is None:
            return Response({"detail": "Témoignage introuvable dans votre périmètre."}, status=status.HTTP_404_NOT_FOUND)
        new_status = request.data.get("status")
        if new_status not in {Testimony.Status.APPROVED, Testimony.Status.REJECTED, Testimony.Status.PENDING}:
            return Response({"status": "Choisissez un statut de modération valide."}, status=status.HTTP_400_BAD_REQUEST)
        testimony.status = new_status
        testimony.save(update_fields=["status", "updated_at"])
        return Response({"id": testimony.pk, "status": testimony.status})


class PasswordChangeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Votre mot de passe a été modifié."})


class MemberDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        published_sermons = Sermon.objects.filter(is_published=True).select_related("chapel", "preacher")
        upcoming_conventions = Convention.objects.filter(
            is_published=True,
            is_archived=False,
            end_date__gte=now,
        ).order_by("start_date")
        upcoming_events = EvangelizationEvent.objects.filter(
            is_published=True,
            start_date__gte=now,
        ).select_related("chapel").order_by("start_date")

        testimonies = Testimony.objects.filter(author=user).order_by("-created_at")
        registrations = user.convention_registrations.select_related("convention").order_by("-registered_at")
        donations = user.donations.order_by("-created_at")
        successful_donations = donations.filter(status=Donation.Status.SUCCESS)
        donation_total = successful_donations.aggregate(total=Sum("amount"))["total"] or 0

        activity = []
        for testimony in testimonies[:5]:
            activity.append({
                "kind": "testimony",
                "title": testimony.title,
                "description": testimony.get_status_display(),
                "date": testimony.created_at,
                "status": testimony.status,
                "href": "/temoignages",
            })
        for registration in registrations[:5]:
            activity.append({
                "kind": "convention",
                "title": registration.convention.title,
                "description": f"Inscription · {registration.attendees} participant(s)",
                "date": registration.registered_at,
                "status": "REGISTERED",
                "href": f"/conventions/{registration.convention.slug}",
            })
        for donation in donations[:5]:
            activity.append({
                "kind": "donation",
                "title": f"Don de {donation.amount} {donation.currency}",
                "description": donation.get_status_display(),
                "date": donation.created_at,
                "status": donation.status,
                "href": "/dons",
            })
        activity.sort(key=lambda item: item["date"], reverse=True)

        return Response({
            "member": UserProfileSerializer(user, context={"request": request}).data,
            "stats": {
                "testimonies": testimonies.count(),
                "pendingTestimonies": testimonies.filter(status=Testimony.Status.PENDING).count(),
                "conventionRegistrations": registrations.count(),
                "successfulDonations": successful_donations.count(),
                "successfulDonationTotal": str(donation_total),
                "publishedSermons": published_sermons.count(),
                "activeChapels": Chapel.objects.filter(is_active=True).count(),
                "upcomingConventions": upcoming_conventions.count(),
            },
            "recentActivity": activity[:8],
            "sermons": SermonSerializer(published_sermons[:3], many=True, context={"request": request}).data,
            "conventions": ConventionSerializer(upcoming_conventions[:3], many=True, context={"request": request}).data,
            "events": CampaignSerializer(upcoming_events[:3], many=True, context={"request": request}).data,
        })


class MyChapelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        chapel = Chapel.objects.filter(members=request.user).select_related("pastor").first()
        if not chapel:
            return Response({"chapel": None})
        return Response({
            "chapel": MemberChapelSerializer(chapel, context={"request": request}).data,
        })


class ChapelListView(generics.ListAPIView):
    serializer_class = ChapelSerializer
    queryset = Chapel.objects.filter(is_active=True).select_related("pastor")


class ChapelDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        chapel = get_object_or_404(
            Chapel.objects.filter(is_active=True).select_related("pastor"),
            slug=slug,
        )
        return Response(MemberChapelSerializer(chapel, context={"request": request}).data)


class SermonListView(generics.ListAPIView):
    serializer_class = SermonSerializer
    queryset = Sermon.objects.filter(is_published=True).select_related("chapel", "preacher")


class SermonDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, identifier):
        queryset = Sermon.objects.filter(is_published=True).select_related("chapel", "preacher")
        sermon = None
        if identifier.isdecimal():
            sermon = queryset.filter(pk=int(identifier)).first()
        if sermon is None:
            sermon = queryset.filter(slug=identifier).first()
        if not sermon:
            return Response({"detail": "Cette prédication est introuvable."}, status=status.HTTP_404_NOT_FOUND)
        return Response(SermonSerializer(sermon, context={"request": request}).data)


class TestimonyListCreateView(generics.ListCreateAPIView):
    queryset = Testimony.objects.filter(status=Testimony.Status.APPROVED).select_related("author", "chapel")
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        return TestimonyCreateSerializer if self.request.method == "POST" else TestimonySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        media_format = self.request.query_params.get("format")
        chapel_slug = self.request.query_params.get("chapel")
        search = self.request.query_params.get("q", "").strip()
        if media_format in {"texte", "audio", "video"}:
            queryset = queryset.filter(media_type={"texte": "TEXT", "audio": "AUDIO", "video": "VIDEO"}[media_format])
        if chapel_slug:
            queryset = queryset.filter(chapel__slug=chapel_slug)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(content__icontains=search)
                | Q(chapel__name__icontains=search)
                | Q(author__full_name__icontains=search)
            )
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Témoignage soumis pour validation."}, status=status.HTTP_201_CREATED)


class TestimonyDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, identifier):
        queryset = Testimony.objects.filter(status=Testimony.Status.APPROVED).select_related("author", "chapel")
        testimony = queryset.filter(pk=int(identifier)).first() if identifier.isdecimal() else None
        if testimony is None:
            return Response({"detail": "Ce témoignage est introuvable."}, status=status.HTTP_404_NOT_FOUND)
        return Response(TestimonySerializer(testimony, context={"request": request}).data)


class TestimonyCommentListCreateView(APIView):
    def get_permissions(self):
        return [permissions.IsAuthenticated()] if self.request.method == "POST" else [permissions.AllowAny()]

    def get(self, request, identifier):
        testimony = self._get_published_testimony(identifier)
        if testimony is None:
            return Response({"detail": "Ce témoignage est introuvable."}, status=status.HTTP_404_NOT_FOUND)
        comments = testimony.comments.filter(is_approved=True).select_related("author")
        return Response(TestimonyCommentSerializer(comments, many=True).data)

    def post(self, request, identifier):
        testimony = self._get_published_testimony(identifier)
        if testimony is None:
            return Response({"detail": "Ce témoignage est introuvable."}, status=status.HTTP_404_NOT_FOUND)
        serializer = TestimonyCommentSerializer(
            data=request.data,
            context={"request": request, "testimony": testimony},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Votre commentaire a été envoyé pour modération."},
            status=status.HTTP_201_CREATED,
        )

    def _get_published_testimony(self, identifier):
        queryset = Testimony.objects.filter(status=Testimony.Status.APPROVED)
        if identifier.isdecimal():
            return queryset.filter(pk=int(identifier)).first()
        return None


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


class ChurchPageContentView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        content = ChurchPageContent.objects.filter(key="main", is_published=True).first()
        if not content:
            return Response({"detail": "Le contenu de la page CLG n'est pas encore publié."}, status=status.HTTP_404_NOT_FOUND)
        return Response(ChurchPageContentSerializer(content).data)