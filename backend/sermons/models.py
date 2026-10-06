from django.db import models


class Sermon(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    description = models.TextField(blank=True)
    content = models.TextField(blank=True)

    preacher = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="sermons",
    )

    chapel = models.ForeignKey(
        "chapels.Chapel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="sermons",
    )

    preaching_date = models.DateTimeField()

    video = models.FileField(
        upload_to="sermons/videos/",
        null=True,
        blank=True,
    )

    audio = models.FileField(
        upload_to="sermons/audio/",
        null=True,
        blank=True,
    )

    thumbnail = models.ImageField(
        upload_to="sermons/thumbnails/",
        null=True,
        blank=True,
    )

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-preaching_date"]

    def __str__(self):
        return self.title
