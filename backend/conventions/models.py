from django.db import models


class Convention(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    description = models.TextField(blank=True)

    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=255, blank=True)
    program = models.JSONField(default=list, blank=True)

    cover_image = models.ImageField(
        upload_to="conventions/covers/",
        null=True,
        blank=True,
    )

    is_published = models.BooleanField(default=True)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return self.title


class ConventionRegistration(models.Model):
    convention = models.ForeignKey(
        Convention,
        on_delete=models.CASCADE,
        related_name="registrations",
    )

    member = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="convention_registrations",
    )

    full_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    chapel_name = models.CharField(max_length=180, blank=True)
    attendees = models.PositiveSmallIntegerField(default=1)

    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["convention", "member"]

    def __str__(self):
        return self.full_name


class ConventionTestimony(models.Model):
    convention = models.ForeignKey(
        Convention,
        on_delete=models.CASCADE,
        related_name="testimonies",
    )

    author = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)

    audio = models.FileField(
        upload_to="conventions/testimonies/audio/",
        null=True,
        blank=True,
    )

    video = models.FileField(
        upload_to="conventions/testimonies/video/",
        null=True,
        blank=True,
    )

    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Choir(models.Model):
    convention = models.ForeignKey(
        Convention,
        on_delete=models.CASCADE,
        related_name="choirs",
    )

    chapel = models.ForeignKey(
        "chapels.Chapel",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="choirs",
    )

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ChoirSong(models.Model):
    choir = models.ForeignKey(
        Choir,
        on_delete=models.CASCADE,
        related_name="songs",
    )

    title = models.CharField(max_length=255)
    lyrics = models.TextField(blank=True)

    audio = models.FileField(
        upload_to="conventions/choirs/audio/",
        null=True,
        blank=True,
    )

    video = models.FileField(
        upload_to="conventions/choirs/video/",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ChoirGallery(models.Model):
    choir = models.ForeignKey(
        Choir,
        on_delete=models.CASCADE,
        related_name="gallery",
    )

    image = models.ImageField(
        upload_to="conventions/choirs/gallery/",
    )

    caption = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.caption or f"Photo - {self.choir.name}"
