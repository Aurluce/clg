This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## API et backend Django

Les appels HTTP sont centralisés dans [lib/api.ts](lib/api.ts) : gestion des erreurs, envoi JSON ou multipart, types de payloads et méthodes par domaine. Les formulaires de connexion, inscription, contact, convention, témoignage et don utilisent cette couche.

Copier `.env.example` vers `.env.local` et renseigner `NEXT_PUBLIC_API_BASE_URL` avec l’URL racine du backend (sans slash final), par exemple `http://localhost:8000`. Cette variable ne doit contenir aucun secret.

Contrats attendus côté backend :

| Fonction | Méthode / endpoint | Corps / réponse principale |
| --- | --- | --- |
| Connexion JWT | `POST /api/auth/token/` | `{ email, password }` → `{ access, refresh?, user? }` |
| Création de compte | `POST /api/auth/register/` | `fullName, email, phone, country, city, churchStatus, chapelSlug?, password` |
| Contact | `POST /api/contact/` | `{ name, email, subject, message }` |
| Inscription convention | `POST /api/conventions/{slug}/register/` | `{ name, chapel, phone, attendees }` |
| Témoignage | `POST /api/testimonies/` | multipart : `name`, `chapel`, `format`, `content` ou `file` |
| Don | `POST /api/donations/` | `{ amount, currency: "XAF" }` → `{ paymentUrl?, message? }` |
| Contenus | `GET /api/chapels/`, `/api/sermons/`, `/api/testimonies/`, `/api/conventions/`, `/api/books/`, `/api/campaigns/` | listes typées ; chorales via `/api/conventions/{slug}/choir-songs/` |

Ces routes sont des contrats à implémenter côté Django. Les pages de contenu utilisent encore les données de démonstration de `lib/mock/content.ts`. Configurer CORS si le frontend et le backend ont des origines différentes. En production, privilégier des cookies `HttpOnly`, `Secure`, `SameSite` gérés par le backend ; aucun jeton n’est persisté dans `localStorage`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
