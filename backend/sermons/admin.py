from django.contrib import admin

from .models import Sermon


@admin.register(Sermon)
class SermonAdmin(admin.ModelAdmin):
	list_display = ("title", "chapel", "preacher", "preaching_date", "is_published")
	list_filter = ("is_published", "chapel", "preaching_date")
	search_fields = ("title", "description", "content", "preacher__full_name", "chapel__name")
	prepopulated_fields = {"slug": ("title",)}
	date_hierarchy = "preaching_date"
	readonly_fields = ("created_at", "updated_at")
	fieldsets = (
		("Prédication", {"fields": ("title", "slug", "description", "content", "preacher", "chapel", "preaching_date")}),
		("Médias", {"fields": ("video", "audio", "thumbnail")}),
		("Publication", {"fields": ("is_published", "created_at", "updated_at")}),
	)
