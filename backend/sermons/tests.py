from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from accounts.models import User
from chapels.models import Chapel
from .models import Sermon
from datetime import timedelta


class PublicSermonApiTests(TestCase):
	def setUp(self):
		self.preacher = User.objects.create_user(
			email="preacher@example.com",
			password="test-password-strong",
			full_name="Pasteur Test",
		)
		self.chapel = Chapel.objects.create(
			name="CLG Test",
			slug="clg-test",
			country="Cameroun",
			city="Douala",
		)
		self.client = APIClient()

	def test_list_returns_all_published_sermons_with_text_and_media_urls(self):
		Sermon.objects.create(
			title="Message écrit",
			slug="message-ecrit",
			description="Une description du message.",
			content="Texte intégral du message.",
			preacher=self.preacher,
			chapel=self.chapel,
			preaching_date=timezone.now(),
			is_published=True,
		)
		Sermon.objects.create(
			title="Brouillon",
			slug="brouillon",
			preacher=self.preacher,
			preaching_date=timezone.now(),
			is_published=False,
		)

		response = self.client.get("/api/sermons/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["format"], "texte")
		self.assertEqual(response.data[0]["content"], "Texte intégral du message.")
		self.assertIn("videoUrl", response.data[0])
		self.assertIn("audioUrl", response.data[0])

	def test_detail_supports_slug_and_hides_unpublished_sermons(self):
		Sermon.objects.create(
			title="Publié",
			slug="message-publie",
			preaching_date=timezone.now(),
			is_published=True,
		)
		Sermon.objects.create(
			title="Non publié",
			slug="message-secret",
			preaching_date=timezone.now(),
			is_published=False,
		)

		self.assertEqual(self.client.get("/api/sermons/message-publie/").status_code, 200)
		self.assertEqual(self.client.get("/api/sermons/message-secret/").status_code, 404)


class PastorSermonManagementApiTests(TestCase):
	def setUp(self):
		self.pastor = User.objects.create_user(
			email="manager@example.com",
			password="Initial-password-4!",
			full_name="Pasteur Gestionnaire",
			system_role=User.SystemRole.PASTOR_ADMIN,
		)
		self.chapel = Chapel.objects.create(
			name="CLG Yaoundé",
			slug="clg-yaounde",
			country="Cameroun",
			city="Yaoundé",
			pastor=self.pastor,
		)
		self.other_pastor = User.objects.create_user(
			email="other-pastor@example.com",
			password="Initial-password-4!",
			full_name="Pasteur Autre",
			church_status=User.ChurchStatus.PASTEUR,
		)
		self.other_chapel = Chapel.objects.create(
			name="CLG Douala",
			slug="clg-douala",
			country="Cameroun",
			city="Douala",
			pastor=self.other_pastor,
		)
		self.client = APIClient()
		self.client.force_authenticate(self.pastor)

	def test_chapel_options_and_pastor_choices_follow_chapel(self):
		chapels = self.client.get("/api/pastor/sermons/options/chapels/")
		preachers = self.client.get(
			f"/api/pastor/sermons/options/chapels/{self.chapel.slug}/preachers/"
		)

		self.assertEqual(chapels.status_code, 200)
		self.assertEqual([item["slug"] for item in chapels.data], [self.chapel.slug])
		self.assertEqual(preachers.status_code, 200)
		self.assertEqual([item["id"] for item in preachers.data], [self.pastor.pk])

	def test_pastor_can_create_and_update_text_sermon_linked_to_own_chapel(self):
		payload = {
			"title": "La foi qui grandit",
			"description": "Une étude biblique.",
			"content": "Texte complet de la prédication.",
			"chapelSlug": self.chapel.slug,
			"preacherId": self.pastor.pk,
			"date": (timezone.now() - timedelta(days=1)).isoformat(),
			"mediaType": "TEXT",
			"isPublished": "true",
		}
		response = self.client.post("/api/pastor/sermons/", payload, format="multipart")

		self.assertEqual(response.status_code, 201)
		sermon = Sermon.objects.get(pk=response.data["id"])
		self.assertEqual(sermon.chapel, self.chapel)
		self.assertEqual(sermon.preacher, self.pastor)
		self.assertEqual(sermon.content, payload["content"])
		self.assertTrue(sermon.is_published)

		updated = self.client.patch(
			f"/api/pastor/sermons/{sermon.pk}/",
			{"title": "La foi qui grandit encore", "isPublished": "false"},
			format="multipart",
		)
		self.assertEqual(updated.status_code, 200)
		sermon.refresh_from_db()
		self.assertEqual(sermon.title, "La foi qui grandit encore")
		self.assertFalse(sermon.is_published)

	def test_pastor_cannot_assign_another_chapel_or_its_pastor(self):
		response = self.client.post(
			"/api/pastor/sermons/",
			{
				"title": "Message hors périmètre",
				"content": "Texte.",
				"chapelSlug": self.other_chapel.slug,
				"preacherId": self.other_pastor.pk,
				"date": timezone.now().isoformat(),
				"mediaType": "TEXT",
			},
			format="multipart",
		)

		self.assertEqual(response.status_code, 400)
		self.assertFalse(Sermon.objects.filter(title="Message hors périmètre").exists())
