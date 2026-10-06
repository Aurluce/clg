# API backend CLG

Backend Django REST Framework avec PostgreSQL, authentification JWT et endpoints compatibles avec le frontend Next.js.

## Lancer en local

1. Copier `.env.example` vers `.env` et remplacer les valeurs par les secrets locaux.
2. Démarrer PostgreSQL avec `docker compose up -d db` (Docker requis), ou fournir une instance PostgreSQL par variables d’environnement.
3. Depuis ce dossier, activer le virtualenv puis installer les dépendances : `python -m pip install -r requirements.txt`.
4. Appliquer les migrations : `python manage.py migrate`.
5. Créer un administrateur : `python manage.py createsuperuser` (identifiant = e-mail).
6. Démarrer le serveur : `python manage.py runserver`.

L’API est disponible sous `/api/`, l’administration sous `/admin/`, et l’état PostgreSQL sous `/api/health/`. Pour tests sans serveur PostgreSQL, définir `DB_ENGINE=sqlite` avant `python manage.py test`.

## Endpoints

- `POST /api/auth/token/` et `POST /api/auth/token/refresh/`
- `POST /api/auth/register/`
- `GET /api/chapels/`, `/api/sermons/`, `/api/testimonies/`, `/api/conventions/`, `/api/books/`, `/api/campaigns/`
- `POST /api/contact/`, `/api/testimonies/`, `/api/donations/`
- `POST /api/conventions/<slug>/register/` et `GET /api/conventions/<slug>/choir-songs/`

Les témoignages soumis restent en attente de modération et les endpoints publics ne retournent que les contenus approuvés/publiés. Le don enregistre une intention seulement : intégrer un prestataire de paiement et ses webhooks avant de considérer un paiement comme effectué. Les jetons sont courts (15 minutes) ; le frontend de connexion doit encore gérer le cycle de session et son stockage sécurisé.