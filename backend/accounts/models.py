from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Une adresse e-mail est obligatoire.")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        if not extra_fields["is_staff"] or not extra_fields["is_superuser"]:
            raise ValueError("Un superutilisateur doit être staff et superuser.")
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class SystemRole(models.TextChoices):
        MEMBER = "MEMBER", "Membre"
        PASTOR_ADMIN = "PASTOR_ADMIN", "Administrateur pasteur"
        DEVELOPER = "DEVELOPER", "Développeur"
        SUPER_ADMIN = "SUPER_ADMIN", "Super administrateur"

    class ChurchStatus(models.TextChoices):
        SIMPLE_FIDELE = "SIMPLE_FIDELE", "Simple fidèle"
        ASPIRANT = "ASPIRANT", "Aspirant"
        DIACRE = "DIACRE", "Diacre"
        ENUQUE = "ENUQUE", "Énuque"
        PASTEUR = "PASTEUR", "Pasteur"
        INSTRUMENTISTE = "INSTRUMENTISTE", "Instrumentiste"
        CHORISTE = "CHORISTE", "Choriste"
        MONITEUR = "MONITEUR/TRICE", "Moniteur/trice"
        EVANGELISTE = "EVANGELISTE", "Évangéliste"

    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=150, blank=True)
    system_role = models.CharField(max_length=30, choices=SystemRole.choices, default=SystemRole.MEMBER)
    church_status = models.CharField(max_length=30, choices=ChurchStatus.choices, default=ChurchStatus.SIMPLE_FIDELE)
    chapel = models.ForeignKey("chapels.Chapel", on_delete=models.SET_NULL, null=True, blank=True, related_name="members")
    profile_photo = models.ImageField(upload_to="profiles/", null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.full_name or self.email
