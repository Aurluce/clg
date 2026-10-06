from django.db import models


class Chapel(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    country = models.CharField(max_length=100)
    region = models.CharField(max_length=150, blank=True)
    city = models.CharField(max_length=150)

    address = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)

    description = models.TextField(blank=True)

    pastor = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="pastored_chapels",
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["country", "city", "name"]

    def __str__(self):
        return self.name


class ChapelActivity(models.Model):
    chapel = models.ForeignKey(
        Chapel,
        on_delete=models.CASCADE,
        related_name="activities",
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)

    image = models.ImageField(
        upload_to="chapels/activities/",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return self.title
