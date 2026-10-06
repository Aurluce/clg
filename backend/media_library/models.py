from django.db import models


class Media(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = "IMAGE", "Image"
        AUDIO = "AUDIO", "Audio"
        VIDEO = "VIDEO", "Vidéo"
        DOCUMENT = "DOCUMENT", "Document"

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    media_type = models.CharField(
        max_length=20,
        choices=MediaType.choices,
    )

    file = models.FileField(
        upload_to="media/",
    )

    uploaded_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="uploaded_media",
    )

    is_public = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
