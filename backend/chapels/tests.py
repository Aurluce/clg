from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient

from .models import Chapel, ChapelActivity


class PublicChapelDetailTests(TestCase):
	def test_detail_returns_chapel_position_and_related_activities(self):
		chapel = Chapel.objects.create(
			name="CLG Centre",
			slug="clg-centre",
			country="Cameroun",
			city="Douala",
			address="Bonanjo",
			latitude="4.0500000",
			longitude="9.7000000",
			phone="+237600000000",
			description="Une communauté de foi.",
		)
		ChapelActivity.objects.create(
			chapel=chapel,
			title="Réunion de prière",
			date=timezone.now() + timedelta(days=1),
		)

		response = APIClient().get("/api/chapels/clg-centre/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["latitude"], "4.0500000")
		self.assertEqual(response.data["phone"], "+237600000000")
		self.assertEqual(response.data["activities"][0]["title"], "Réunion de prière")

	def test_detail_does_not_return_inactive_chapels(self):
		Chapel.objects.create(
			name="Chapelle inactive",
			slug="inactive",
			country="Cameroun",
			city="Douala",
			is_active=False,
		)

		response = APIClient().get("/api/chapels/inactive/")

		self.assertEqual(response.status_code, 404)
