from django.db import models


class Book(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)

    author = models.CharField(
        max_length=255,
        default="Apôtre T. Beaudelaire",
    )

    description = models.TextField(blank=True)

    cover = models.ImageField(
        upload_to="books/covers/",
        null=True,
        blank=True,
    )

    pdf = models.FileField(
        upload_to="books/pdf/",
        null=True,
        blank=True,
    )

    purchase_url = models.URLField(blank=True)

    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title
