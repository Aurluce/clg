from django.test import TestCase
from rest_framework.test import APIClient

from .models import ChurchPageContent


class ChurchPageContentApiTests(TestCase):
	def test_public_page_content_is_read_from_database(self):
		ChurchPageContent.objects.filter(key="main").update(
			hero_title="Une identité administrable",
			genesis="Histoire modifiée par l'administration.",
			short_term_objective="Former les responsables.",
			is_published=True,
		)

		response = APIClient().get("/api/church-page/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["heroTitle"], "Une identité administrable")
		self.assertEqual(response.data["genesis"], "Histoire modifiée par l'administration.")
		self.assertEqual(response.data["shortTermObjective"], "Former les responsables.")

	def test_unpublished_page_content_is_not_public(self):
		ChurchPageContent.objects.filter(key="main").update(is_published=False)

		response = APIClient().get("/api/church-page/")

		self.assertEqual(response.status_code, 404)
