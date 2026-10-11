from django.db import migrations, models


def create_default_page_content(apps, schema_editor):
    ChurchPageContent = apps.get_model("churches", "ChurchPageContent")
    ChurchPageContent.objects.get_or_create(
        key="main",
        defaults={
            "scripture_reference": "1 Timothée 3.15",
            "hero_title": "L'appui et la colonne de la vérité.",
            "hero_subtitle": "Avec Jésus, on peut recommencer et faire mieux.",
            "scripture_quote": "L'Église du Dieu vivant, colonne et appui de la vérité.",
            "genesis": "Cette section présentera l'histoire de la fondation de la CLG par l'apôtre T. Beaudelaire — à rédiger avec l'Église pour remplacer ce texte provisoire.",
            "vision": "Cette section présentera la vision de la CLG — à rédiger avec l'Église pour remplacer ce texte provisoire.",
            "objectives_intro": "Les objectifs de la CLG, à court, moyen et long terme.",
            "short_term_objective": "Objectif à préciser avec l'Église.",
            "medium_term_objective": "Objectif à préciser avec l'Église.",
            "long_term_objective": "Objectif à préciser avec l'Église.",
            "cta_eyebrow": "Faites partie de l'histoire",
            "cta_title": "Rejoignez une chapelle près de chez vous",
            "cta_text": "La CLG, c'est d'abord des hommes et des femmes réunis autour de la Parole. Venez comme vous êtes.",
            "is_published": True,
        },
    )


class Migration(migrations.Migration):
    dependencies = [("churches", "0001_initial")]

    operations = [
        migrations.CreateModel(
            name="ChurchPageContent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(default="main", editable=False, max_length=20, unique=True)),
                ("scripture_reference", models.CharField(default="1 Timothée 3.15", max_length=80)),
                ("hero_title", models.CharField(default="L'appui et la colonne de la vérité.", max_length=255)),
                ("hero_subtitle", models.CharField(default="Avec Jésus, on peut recommencer et faire mieux.", max_length=255)),
                ("scripture_quote", models.TextField(default="L'Église du Dieu vivant, colonne et appui de la vérité.")),
                ("genesis", models.TextField(blank=True)),
                ("vision", models.TextField(blank=True)),
                ("objectives_intro", models.TextField(default="Les objectifs de la CLG, à court, moyen et long terme.")),
                ("short_term_objective", models.TextField(blank=True)),
                ("medium_term_objective", models.TextField(blank=True)),
                ("long_term_objective", models.TextField(blank=True)),
                ("cta_eyebrow", models.CharField(default="Faites partie de l'histoire", max_length=150)),
                ("cta_title", models.CharField(default="Rejoignez une chapelle près de chez vous", max_length=255)),
                ("cta_text", models.TextField(default="La CLG, c'est d'abord des hommes et des femmes réunis autour de la Parole. Venez comme vous êtes.")),
                ("is_published", models.BooleanField(default=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "verbose_name": "Contenu de la page CLG",
                "verbose_name_plural": "Contenu de la page CLG",
            },
        ),
        migrations.RunPython(create_default_page_content, migrations.RunPython.noop),
    ]
