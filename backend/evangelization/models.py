from django.db import models


class EvangelizationEvent(models.Model):
    class EventType(models.TextChoices):
        CRUSADE = "CRUSADE", "Croisade"
        EVANGELIZATION = "EVANGELIZATION", "Évangélisation"
        PROGRAM = "PROGRAM", "Programme"
        OUTREACH = "OUTREACH", "Mission"

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    event_type = models.CharField(
        max_length=30,
        choices=EventType.choices,
    )

    description = models.TextField()

    chapel = models.ForeignKey(
        "chapels.Chapel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="evangelization_events",
    )

    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=255, blank=True)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)

    image = models.ImageField(
        upload_to="evangelization/",
        null=True,
        blank=True,
    )

    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return self.title
