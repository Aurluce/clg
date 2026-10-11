from django.contrib import admin

from .models import ChurchPageContent, ContactMessage


@admin.register(ChurchPageContent)
class ChurchPageContentAdmin(admin.ModelAdmin):
	fieldsets = (
		("En-tête et verset", {"fields": ("scripture_reference", "hero_title", "hero_subtitle", "scripture_quote")}),
		("Identité de l'Église", {"fields": ("genesis", "vision")}),
		("Objectifs", {"fields": ("objectives_intro", "short_term_objective", "medium_term_objective", "long_term_objective")}),
		("Bandeau final", {"fields": ("cta_eyebrow", "cta_title", "cta_text")}),
		("Publication", {"fields": ("is_published", "updated_at")}),
	)
	readonly_fields = ("updated_at",)
	list_display = ("__str__", "is_published", "updated_at")

	def has_add_permission(self, request):
		return not ChurchPageContent.objects.exists()

	def has_delete_permission(self, request, obj=None):
		return False


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
	list_display = ("name", "email", "subject", "is_resolved", "created_at")
	list_filter = ("is_resolved", "subject", "created_at")
	search_fields = ("name", "email", "message")
	readonly_fields = ("created_at",)
