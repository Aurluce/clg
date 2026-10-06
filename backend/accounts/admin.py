from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
	ordering = ("email",)
	list_display = ("email", "full_name", "system_role", "church_status", "is_staff", "is_active")
	search_fields = ("email", "full_name", "phone")
	fieldsets = (
		(None, {"fields": ("email", "password")}),
		("Identité et Église", {"fields": ("full_name", "phone", "country", "city", "church_status", "chapel", "profile_photo")}),
		("Rôles et accès", {"fields": ("system_role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions", "is_verified", "is_approved")}),
		("Dates", {"fields": ("last_login", "date_joined")}),
	)
	add_fieldsets = ((None, {"classes": ("wide",), "fields": ("email", "full_name", "password1", "password2")}),)
	filter_horizontal = ("groups", "user_permissions")
