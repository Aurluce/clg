# CLG — Espace Administrateur Pasteur

Interface pour Next.js App Router avec Tailwind CSS, Recharts, Framer Motion et Lucide React.

## Intégration recommandée
1. Décompressez le ZIP.
2. Copiez le contenu du dossier `pastor_admin` dans `src/app/dashboard/pastor_admin/` de votre projet Next.js. La structure obtenue doit être par exemple `src/app/dashboard/pastor_admin/page.tsx`, `src/app/dashboard/pastor_admin/membres/page.tsx`, etc.
3. Les composants et données restent regroupés dans `src/app/dashboard/pastor_admin/components` et `src/app/dashboard/pastor_admin/lib`.
4. Installez les dépendances si elles ne sont pas déjà présentes :
   ```bash
   npm install recharts framer-motion lucide-react
   ```
5. Tailwind CSS doit déjà être configuré dans le projet.
6. Lancez `npm run dev`, puis ouvrez `/dashboard/pastor_admin`.

## Pages incluses
- `/dashboard/pastor_admin` : tableau de bord avec KPI, graphiques, présence, dons, agenda et raccourcis.
- `/dashboard/pastor_admin/membres`
- `/dashboard/pastor_admin/activites`
- `/dashboard/pastor_admin/predications`
- `/dashboard/pastor_admin/temoignages`
- `/dashboard/pastor_admin/evenements`
- `/dashboard/pastor_admin/dons`
- `/dashboard/pastor_admin/rapports`
- `/dashboard/pastor_admin/parametres`

## À connecter à votre backend
Les données sont des exemples d'interface. Remplacez-les par les réponses de votre API Django REST Framework. Le backend doit vérifier le rôle `PASTOR_ADMIN` et limiter toutes les requêtes aux données de la chapelle du pasteur connecté. Le contrôle d'accès côté interface ne remplace jamais les permissions Django.
