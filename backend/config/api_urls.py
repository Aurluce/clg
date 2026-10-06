from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .api_views import (
    BookListView,
    CampaignListView,
    ChapelListView,
    ChoirSongListView,
    ContactCreateView,
    ConventionListView,
    ConventionRegistrationView,
    CurrentUserView,
    DonationCreateView,
    EmailTokenView,
    HealthView,
    RegisterView,
    SermonListView,
    TestimonyListCreateView,
)

urlpatterns = [
    path("health/", HealthView.as_view(), name="api-health"),
    path("auth/token/", EmailTokenView.as_view(), name="token-obtain-pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/me/", CurrentUserView.as_view(), name="current-user"),
    path("chapels/", ChapelListView.as_view(), name="chapel-list"),
    path("sermons/", SermonListView.as_view(), name="sermon-list"),
    path("testimonies/", TestimonyListCreateView.as_view(), name="testimony-list-create"),
    path("conventions/", ConventionListView.as_view(), name="convention-list"),
    path("conventions/<slug:slug>/register/", ConventionRegistrationView.as_view(), name="convention-register"),
    path("conventions/<slug:slug>/choir-songs/", ChoirSongListView.as_view(), name="choir-song-list"),
    path("books/", BookListView.as_view(), name="book-list"),
    path("campaigns/", CampaignListView.as_view(), name="campaign-list"),
    path("contact/", ContactCreateView.as_view(), name="contact-create"),
    path("donations/", DonationCreateView.as_view(), name="donation-create"),
]