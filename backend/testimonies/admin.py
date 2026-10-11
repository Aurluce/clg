from django.contrib import admin

from .models import Testimony, TestimonyComment


class TestimonyCommentInline(admin.TabularInline):
	model = TestimonyComment
	extra = 0
	readonly_fields = ("author", "content", "created_at")
	fields = ("author", "content", "created_at", "is_approved")


@admin.register(Testimony)
class TestimonyAdmin(admin.ModelAdmin):
	list_display = ("title", "media_type", "author", "chapel", "status", "is_anonymous", "created_at")
	list_filter = ("status", "media_type", "is_anonymous", "chapel", "created_at")
	search_fields = ("title", "content", "author__full_name", "chapel__name")
	readonly_fields = ("created_at", "updated_at")
	list_editable = ("status",)
	inlines = (TestimonyCommentInline,)


@admin.register(TestimonyComment)
class TestimonyCommentAdmin(admin.ModelAdmin):
	list_display = ("testimony", "author", "is_approved", "created_at")
	list_filter = ("is_approved", "created_at")
	search_fields = ("content", "author__full_name", "testimony__title")
	readonly_fields = ("created_at",)
	list_editable = ("is_approved",)
