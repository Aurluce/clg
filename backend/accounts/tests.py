from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from chapels.models import Chapel, ChapelActivity
from conventions.models import Convention, ConventionRegistration
from donations.models import Donation
from testimonies.models import Testimony
from django.utils import timezone
from datetime import datetime, time, timedelta


class UserProfileApiTests(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(
			email="member@example.com",
			password="Initial-password-4!",
			full_name="Membre Exemple",
			phone="+237600000000",
			country="Cameroun",
			city="Douala",
		)
		self.client = APIClient()
		self.client.force_authenticate(self.user)

	def test_profile_returns_complete_member_details(self):
		response = self.client.get("/api/auth/profile/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["fullName"], "Membre Exemple")
		self.assertEqual(response.data["phone"], "+237600000000")
		self.assertEqual(response.data["city"], "Douala")
		self.assertIn("profilePhoto", response.data)

	def test_member_can_update_personal_details_but_not_role(self):
		response = self.client.patch(
			"/api/auth/profile/",
			{"fullName": "Nouveau Nom", "city": "Yaoundé", "systemRole": "SUPER_ADMIN"},
			format="json",
		)

		self.assertEqual(response.status_code, 200)
		self.user.refresh_from_db()
		self.assertEqual(self.user.full_name, "Nouveau Nom")
		self.assertEqual(self.user.city, "Yaoundé")
		self.assertEqual(self.user.system_role, User.SystemRole.MEMBER)

	def test_member_can_change_password_after_current_password_check(self):
		response = self.client.post(
			"/api/auth/password/",
			{"currentPassword": "Initial-password-4!", "newPassword": "Rivière!Nuage2026#"},
			format="json",
		)

		self.assertEqual(response.status_code, 200)
		self.user.refresh_from_db()
		self.assertTrue(self.user.check_password("Rivière!Nuage2026#"))

	def test_password_change_rejects_incorrect_current_password(self):
		response = self.client.post(
			"/api/auth/password/",
			{"currentPassword": "incorrect", "newPassword": "Rivière!Nuage2026#"},
			format="json",
		)

		self.assertEqual(response.status_code, 400)
		self.assertTrue(self.user.check_password("Initial-password-4!"))

	def test_dashboard_returns_member_database_data_and_owned_activity(self):
		convention = Convention.objects.create(
			title="Convention de test",
			slug="convention-test",
			start_date=timezone.now() + timedelta(days=10),
			end_date=timezone.now() + timedelta(days=12),
			is_published=True,
		)
		ConventionRegistration.objects.create(
			convention=convention,
			member=self.user,
			full_name=self.user.full_name,
			attendees=2,
		)
		Testimony.objects.create(
			author=self.user,
			title="Mon témoignage",
			content="Un récit de test.",
			status=Testimony.Status.PENDING,
		)
		Donation.objects.create(
			donor=self.user,
			amount="2500.00",
			currency="XAF",
			payment_method=Donation.PaymentMethod.OTHER,
			status=Donation.Status.SUCCESS,
		)

		response = self.client.get("/api/auth/dashboard/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["member"]["fullName"], self.user.full_name)
		self.assertEqual(response.data["stats"]["testimonies"], 1)
		self.assertEqual(response.data["stats"]["pendingTestimonies"], 1)
		self.assertEqual(response.data["stats"]["conventionRegistrations"], 1)
		self.assertEqual(response.data["stats"]["successfulDonationTotal"], "2500.00")
		self.assertEqual(len(response.data["recentActivity"]), 3)

	def test_member_chapel_returns_assigned_chapel_and_published_related_records(self):
		chapel = Chapel.objects.create(
			name="CLG Douala Centre",
			slug="clg-douala-centre",
			country="Cameroun",
			city="Douala",
			address="Bonanjo",
			phone="+237600000000",
			description="Une communauté de foi.",
		)
		self.user.chapel = chapel
		self.user.save(update_fields=["chapel"])
		ChapelActivity.objects.create(
			chapel=chapel,
			title="Rencontre de prière",
			date=timezone.now() + timedelta(days=1),
			location="Salle principale",
		)

		response = self.client.get("/api/auth/my-chapel/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["chapel"]["name"], "CLG Douala Centre")
		self.assertEqual(response.data["chapel"]["memberCount"], 1)
		self.assertEqual(response.data["chapel"]["activities"][0]["title"], "Rencontre de prière")

	def test_member_chapel_is_null_when_user_has_no_assigned_chapel(self):
		response = self.client.get("/api/auth/my-chapel/")

		self.assertEqual(response.status_code, 200)
		self.assertIsNone(response.data["chapel"])

	def test_public_chapel_list_includes_coordinates_for_map(self):
		chapel = Chapel.objects.create(
			name="CLG Yaoundé",
			slug="clg-yaounde",
			country="Cameroun",
			city="Yaoundé",
			latitude="3.8480000",
			longitude="11.5020000",
		)

		response = APIClient().get("/api/chapels/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data[0]["id"], str(chapel.pk))
		self.assertEqual(response.data[0]["latitude"], "3.8480000")
		self.assertEqual(response.data[0]["longitude"], "11.5020000")


class PastorManagementApiTests(TestCase):
	def setUp(self):
		self.pastor = User.objects.create_user(
			email="pastor@example.com",
			password="Initial-password-4!",
			full_name="Pasteur Exemple",
			system_role=User.SystemRole.PASTOR_ADMIN,
		)
		self.chapel = Chapel.objects.create(
			name="CLG Yaoundé",
			slug="clg-yaounde",
			country="Cameroun",
			city="Yaoundé",
			pastor=self.pastor,
		)
		self.other_chapel = Chapel.objects.create(
			name="CLG Douala",
			slug="clg-douala",
			country="Cameroun",
			city="Douala",
		)
		self.client = APIClient()
		self.client.force_authenticate(self.pastor)

	def test_pastor_can_create_member_and_list_only_own_chapel_members(self):
		response = self.client.post(
			"/api/pastor/members/",
			{
				"fullName": "Nouveau Fidèle",
				"email": "nouveau@example.com",
				"phone": "+237600000000",
				"country": "Cameroun",
				"city": "Yaoundé",
				"churchStatus": User.ChurchStatus.SIMPLE_FIDELE,
				"password": "Strong!Pass2026#",
			},
			format="json",
		)

		self.assertEqual(response.status_code, 201)
		member = User.objects.get(email="nouveau@example.com")
		self.assertEqual(member.system_role, User.SystemRole.MEMBER)
		self.assertEqual(member.chapel, self.chapel)
		self.assertTrue(member.check_password("Strong!Pass2026#"))
		self.assertEqual(self.client.get("/api/pastor/members/").data[0]["id"], str(member.pk))

	def test_pastor_cannot_create_member_for_another_chapel(self):
		response = self.client.post(
			"/api/pastor/members/",
			{
				"fullName": "Autre Fidèle",
				"email": "autre@example.com",
				"phone": "+237600000000",
				"country": "Cameroun",
				"city": "Douala",
				"churchStatus": User.ChurchStatus.SIMPLE_FIDELE,
				"password": "Strong!Pass2026#",
				"chapelSlug": self.other_chapel.slug,
			},
			format="json",
		)

		self.assertEqual(response.status_code, 400)
		self.assertFalse(User.objects.filter(email="autre@example.com").exists())

	def test_pastor_can_create_and_delete_activity_for_own_chapel(self):
		response = self.client.post(
			"/api/pastor/activities/",
			{
				"title": "Étude biblique",
				"description": "Rencontre hebdomadaire",
				"date": (timezone.now() + timedelta(days=1)).isoformat(),
				"location": "Salle principale",
			},
			format="json",
		)

		self.assertEqual(response.status_code, 201)
		activity_id = response.data["id"]
		self.assertEqual(ChapelActivity.objects.get(pk=activity_id).chapel, self.chapel)
		self.assertEqual(self.client.delete(f"/api/pastor/activities/{activity_id}/").status_code, 204)

	def test_regular_member_cannot_use_pastor_endpoints(self):
		member = User.objects.create_user(
			email="ordinary@example.com",
			password="Initial-password-4!",
			full_name="Membre Standard",
		)
		self.client.force_authenticate(member)

		self.assertEqual(self.client.get("/api/pastor/members/").status_code, 403)

	def test_pastor_can_moderate_testimony_from_own_chapel(self):
		testimony = Testimony.objects.create(
			author=None,
			chapel=self.chapel,
			title="Témoignage en attente",
			content="Un récit de foi.",
			status=Testimony.Status.PENDING,
		)

		response = self.client.patch(
			f"/api/pastor/testimonies/{testimony.pk}/",
			{"status": Testimony.Status.APPROVED},
			format="json",
		)

		self.assertEqual(response.status_code, 200)
		testimony.refresh_from_db()
		self.assertEqual(testimony.status, Testimony.Status.APPROVED)

	def test_dashboard_overview_returns_real_chapel_data_and_next_sunday_activity(self):
		member = User.objects.create_user(
			email="dashboard-member@example.com",
			password="Initial-password-4!",
			full_name="Membre Tableau",
			chapel=self.chapel,
		)
		activity_date = timezone.localdate() + timedelta(days=(6 - timezone.localdate().weekday()) % 7 or 7)
		activity = ChapelActivity.objects.create(
			chapel=self.chapel,
			title="Culte dominical",
			date=timezone.make_aware(datetime.combine(activity_date, time(9, 0))),
			location="Sanctuaire",
		)
		Testimony.objects.create(
			author=member,
			chapel=self.chapel,
			title="Témoignage en attente",
			content="Un récit.",
			status=Testimony.Status.PENDING,
		)

		response = self.client.get("/api/pastor/dashboard/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["pastor"]["fullName"], self.pastor.full_name)
		self.assertEqual(response.data["chapel"]["name"], self.chapel.name)
		self.assertEqual(response.data["stats"]["activeMembers"], 1)
		self.assertEqual(response.data["stats"]["pendingTestimonies"], 1)
		self.assertEqual(response.data["nextSunday"]["activity"]["id"], activity.pk)
		self.assertEqual(len(response.data["monthly"]), 6)
