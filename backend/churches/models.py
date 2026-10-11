from django.db import models


class ChurchPageContent(models.Model):
	key = models.CharField(max_length=20, unique=True, default="main", editable=False)
	scripture_reference = models.CharField(max_length=80, default="1 Timothée 3.15")
	hero_title = models.CharField(max_length=255, default="L'appui et la colonne de la vérité.")
	hero_subtitle = models.CharField(max_length=255, default="Avec Jésus, on peut recommencer et faire mieux.")
	scripture_quote = models.TextField(default="L'Église du Dieu vivant, colonne et appui de la vérité.")
	genesis = models.TextField(blank=True)
	vision = models.TextField(blank=True)
	objectives_intro = models.TextField(default="Les objectifs de la CLG, à court, moyen et long terme.")
	short_term_objective = models.TextField(blank=True)
	medium_term_objective = models.TextField(blank=True)
	long_term_objective = models.TextField(blank=True)
	cta_eyebrow = models.CharField(max_length=150, default="Faites partie de l'histoire")
	cta_title = models.CharField(max_length=255, default="Rejoignez une chapelle près de chez vous")
	cta_text = models.TextField(default="La CLG, c'est d'abord des hommes et des femmes réunis autour de la Parole. Venez comme vous êtes.")
	is_published = models.BooleanField(default=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		verbose_name = "Contenu de la page CLG"
		verbose_name_plural = "Contenu de la page CLG"

	def __str__(self):
		return "Page La CLG"


class ContactMessage(models.Model):
	name = models.CharField(max_length=180)
	email = models.EmailField()
	subject = models.CharField(max_length=40, blank=True)
	message = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
	is_resolved = models.BooleanField(default=False)

	class Meta:
		ordering = ["-created_at"]

	def __str__(self):
		return f"{self.subject or 'Contact'} — {self.name}"
