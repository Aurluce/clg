from django.db import models


class Testimony(models.Model):
    class MediaType(models.TextChoices):
        TEXT = "TEXT", "Texte"
        AUDIO = "AUDIO", "Audio"
        VIDEO = "VIDEO", "Vidéo"

    class Status(models.TextChoices):
        PENDING = "PENDING", "En attente"
        APPROVED = "APPROVED", "Approuvé"
        REJECTED = "REJECTED", "Rejeté"

    author = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="testimonies",
    )

    chapel = models.ForeignKey(
        "chapels.Chapel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="testimonies",
    )

    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)

    media_type = models.CharField(
        max_length=20,
        choices=MediaType.choices,
        default=MediaType.TEXT,
    )

    audio = models.FileField(
        upload_to="testimonies/audio/",
        null=True,
        blank=True,
    )

    video = models.FileField(
        upload_to="testimonies/video/",
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    is_anonymous = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class TestimonyComment(models.Model):
    testimony = models.ForeignKey(
        Testimony,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    author = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="testimony_comments",
    )

    content = models.TextField()

    is_approved = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Commentaire de {self.author}"
