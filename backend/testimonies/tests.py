from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import User
from chapels.models import Chapel
from .models import Testimony, TestimonyComment


class TestimonyApiTests(TestCase):
	def setUp(self):
		self.chapel = Chapel.objects.create(
			name="CLG Douala Centre",
			slug="clg-douala-centre",
			country="Cameroun",
			city="Douala",
		)
		self.user = User.objects.create_user(
			email="member@example.com",
			password="Initial-password-4!",
			full_name="Membre CLG",
			chapel=self.chapel,
		)
		self.client = APIClient()

	def test_public_list_only_returns_approved_testimonies_and_supports_filters(self):
		Testimony.objects.create(title="Témoignage écrit", content="Texte approuvé", chapel=self.chapel, status=Testimony.Status.APPROVED)
		Testimony.objects.create(title="Témoignage en attente", content="Pas encore publié", status=Testimony.Status.PENDING)

		response = self.client.get("/api/testimonies/?format=texte&chapel=clg-douala-centre&q=écrit")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["title"], "Témoignage écrit")

	def test_approved_testimony_detail_includes_media_and_comment_count(self):
		testimony = Testimony.objects.create(
			title="Témoignage publié",
			content="Dieu m'a aidé.",
			status=Testimony.Status.APPROVED,
		)
		TestimonyComment.objects.create(testimony=testimony, author=self.user, content="Amen", is_approved=True)
		TestimonyComment.objects.create(testimony=testimony, author=self.user, content="En attente", is_approved=False)

		response = self.client.get(f"/api/testimonies/{testimony.pk}/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["commentCount"], 1)
		self.assertEqual(response.data["content"], "Dieu m'a aidé.")

	def test_submission_is_pending_and_supports_anonymous_identity(self):
		response = self.client.post(
			"/api/testimonies/",
			{
				"name": "",
				"chapel": "CLG Douala Centre",
				"format": "texte",
				"content": "Un témoignage soumis anonymement.",
				"isAnonymous": "true",
			},
			format="multipart",
		)

		self.assertEqual(response.status_code, 201)
		testimony = Testimony.objects.get(title="Témoignage anonyme")
		self.assertEqual(testimony.status, Testimony.Status.PENDING)
		self.assertTrue(testimony.is_anonymous)
		self.assertIsNone(testimony.author)

	def test_audio_submission_saves_uploaded_media(self):
		audio = SimpleUploadedFile("voix.mp3", b"ID3-audio-data", content_type="audio/mpeg")
		response = self.client.post(
			"/api/testimonies/",
			{"name": "Membre CLG", "format": "audio", "file": audio},
			format="multipart",
		)

		self.assertEqual(response.status_code, 201)
		testimony = Testimony.objects.get(title="Témoignage de Membre CLG")
		self.assertTrue(testimony.audio.name.endswith(".mp3"))
		self.assertEqual(testimony.media_type, Testimony.MediaType.AUDIO)

	def test_only_authenticated_members_can_submit_comments_and_comments_need_approval(self):
		testimony = Testimony.objects.create(title="Témoignage publié", content="Texte", status=Testimony.Status.APPROVED)
		url = f"/api/testimonies/{testimony.pk}/comments/"
		self.assertEqual(self.client.post(url, {"content": "Amen"}, format="json").status_code, 401)

		self.client.force_authenticate(self.user)
		response = self.client.post(url, {"content": "Amen"}, format="json")

		self.assertEqual(response.status_code, 201)
		self.assertFalse(TestimonyComment.objects.get().is_approved)
		self.assertEqual(self.client.get(url).data, [])
