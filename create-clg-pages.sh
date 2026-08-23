#!/usr/bin/env bash
set -e

echo "→ Création des dossiers..."
mkdir -p app/chapelles/\[slug\]
mkdir -p app/predications/\[id\]
mkdir -p app/temoignages/\[id\] app/temoignages/nouveau
mkdir -p app/evangelisation app/ouvrages app/dons app/contact app/login app/clg
mkdir -p app/conventions/\[slug\]/inscription app/conventions/\[slug\]/temoignages app/conventions/\[slug\]/chorales
mkdir -p lib/mock
mkdir -p components/content components/ui
mkdir -p types

echo "→ types/content.ts"
cat > types/content.ts << 'EOF'
export interface Chapel {
  slug: string;
  name: string;
  country: string;
  city: string;
  pastorName: string;
  contact: string;
}

export interface Sermon {
  id: string;
  title: string;
  chapelSlug: string;
  chapelName: string;
  preacher: string;
  date: string;
  format: "video" | "audio";
}

export interface Testimony {
  id: string;
  authorName: string;
  chapelName?: string;
  format: "texte" | "audio" | "video";
  excerpt: string;
  content: string;
  date: string;
}

export interface Convention {
  slug: string;
  title: string;
  year: number;
  status: "ancienne" | "nouvelle";
  location: string;
  startDate: string;
  endDate: string;
  program: string[];
}

export interface Book {
  id: string;
  title: string;
  description: string;
}

export interface EvangelizationCampaign {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
}

export interface ChoirSong {
  id: string;
  title: string;
  chapelName: string;
  format: "texte" | "video";
  lyricsExcerpt?: string;
}
EOF

echo "→ lib/mock/content.ts"
cat > lib/mock/content.ts << 'EOF'
import type {
  Chapel, Sermon, Testimony, Convention, Book, EvangelizationCampaign, ChoirSong,
} from "@/types/content";

// À remplacer par des appels à l'API Django (GET /api/chapels, /api/sermons, ...)

export const chapels: Chapel[] = [
  { slug: "douala-centre", name: "CLG Douala Centre", country: "Cameroun", city: "Douala", pastorName: "Pasteur Jean Mbarga", contact: "+237 6XX XXX XXX" },
  { slug: "yaounde-nord", name: "CLG Yaoundé Nord", country: "Cameroun", city: "Yaoundé", pastorName: "Pasteur Paul Nkolo", contact: "+237 6XX XXX XXX" },
  { slug: "bafoussam", name: "CLG Bafoussam", country: "Cameroun", city: "Bafoussam", pastorName: "Pasteur Samuel Fotso", contact: "+237 6XX XXX XXX" },
  { slug: "paris", name: "CLG Paris", country: "France", city: "Paris", pastorName: "Pasteur Élie Manga", contact: "+33 6XX XXX XXX" },
];

export const sermons: Sermon[] = [
  { id: "s1", title: "L'appui et la colonne de la vérité", chapelSlug: "douala-centre", chapelName: "CLG Douala Centre", preacher: "Pasteur Jean Mbarga", date: "2026-08-10", format: "video" },
  { id: "s2", title: "Recommencer avec Jésus", chapelSlug: "yaounde-nord", chapelName: "CLG Yaoundé Nord", preacher: "Pasteur Paul Nkolo", date: "2026-08-03", format: "audio" },
  { id: "s3", title: "Marcher dans la vérité", chapelSlug: "bafoussam", chapelName: "CLG Bafoussam", preacher: "Pasteur Samuel Fotso", date: "2026-07-27", format: "video" },
];

export const testimonies: Testimony[] = [
  { id: "t1", authorName: "Marie A.", chapelName: "CLG Douala Centre", format: "texte", excerpt: "Dieu a transformé ma famille...", content: "Dieu a transformé ma famille depuis que j'ai rejoint la CLG. Ce témoignage complet sera à rédiger avec l'auteur.", date: "2026-08-12" },
  { id: "t2", authorName: "Emmanuel K.", chapelName: "CLG Paris", format: "video", excerpt: "Un nouveau départ après des années difficiles...", content: "Témoignage vidéo — contenu à intégrer.", date: "2026-08-05" },
];

export const conventions: Convention[] = [
  { slug: "convention-2026", title: "Convention Nationale 2026", year: 2026, status: "nouvelle", location: "Douala, Cameroun", startDate: "2026-12-18", endDate: "2026-12-21", program: ["Ouverture et louange", "Enseignement de l'apôtre", "Soirée de témoignages", "Clôture et envoi"] },
  { slug: "convention-2025", title: "Convention Nationale 2025", year: 2025, status: "ancienne", location: "Yaoundé, Cameroun", startDate: "2025-12-19", endDate: "2025-12-22", program: ["Ouverture et louange", "Enseignement de l'apôtre", "Soirée de témoignages", "Clôture et envoi"] },
];

export const books: Book[] = [
  { id: "b1", title: "L'appui et la colonne de la vérité", description: "Ouvrage de l'apôtre T. Beaudelaire — description à compléter." },
  { id: "b2", title: "Recommencer avec Jésus", description: "Ouvrage de l'apôtre T. Beaudelaire — description à compléter." },
];

export const campaigns: EvangelizationCampaign[] = [
  { id: "c1", title: "Croisade de Douala", location: "Douala, Cameroun", date: "2026-09-05", description: "Une semaine d'évangélisation dans les quartiers de Douala." },
  { id: "c2", title: "Croisade de Bafoussam", location: "Bafoussam, Cameroun", date: "2026-10-12", description: "Programme d'évangélisation et de visites communautaires." },
];

export const choirSongs: ChoirSong[] = [
  { id: "ch1", title: "Gloire à Dieu", chapelName: "Chorale CLG Douala", format: "texte", lyricsExcerpt: "Paroles à intégrer avec la chorale." },
  { id: "ch2", title: "Recommencer", chapelName: "Chorale CLG Yaoundé", format: "video" },
];
EOF

echo "→ components/ui/PageHero.tsx"
cat > components/ui/PageHero.tsx << 'EOF'
import { Section } from "./Section";
import { Eyebrow } from "./Eyebrow";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Section className="pb-10 pt-16 md:pt-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-royal md:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-4 max-w-2xl font-body text-lg text-slate">{subtitle}</p>}
    </Section>
  );
}
EOF

echo "→ components/ui/ObjectiveCard.tsx"
cat > components/ui/ObjectiveCard.tsx << 'EOF'
import { cn } from "@/lib/utils/cn";

type Accent = "royal" | "crimson" | "gold";

const accentClasses: Record<Accent, string> = {
  royal: "border-royal text-royal",
  crimson: "border-crimson text-crimson",
  gold: "border-gold-700 text-gold-700",
};

export function ObjectiveCard({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: Accent;
}) {
  return (
    <div className={cn("rounded-sm border-t-4 bg-paper-light p-6 shadow-sm", accentClasses[accent])}>
      <p className="font-mono text-xs uppercase tracking-[0.15em]">{label}</p>
      <p className="mt-3 font-body text-sm text-charcoal">{text}</p>
    </div>
  );
}
EOF

echo "→ components/content/Cards.tsx"
cat > components/content/Cards.tsx << 'EOF'
import Link from "next/link";
import type { Chapel, Sermon, Testimony, Convention, Book, EvangelizationCampaign } from "@/types/content";

const cardBase =
  "rounded-sm border border-royal-100 bg-paper-light p-6 shadow-sm transition-transform hover:-translate-y-1";

export function ChapelCard({ chapel }: { chapel: Chapel }) {
  return (
    <Link href={`/chapelles/${chapel.slug}`} className={`${cardBase} block no-underline`}>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-crimson">
        {chapel.country}
      </p>
      <h3 className="mt-2 font-display text-xl text-royal">{chapel.name}</h3>
      <p className="mt-1 font-body text-sm text-slate">{chapel.city}</p>
      <p className="mt-3 font-body text-sm text-charcoal">Dirigée par {chapel.pastorName}</p>
    </Link>
  );
}

export function SermonCard({ sermon }: { sermon: Sermon }) {
  return (
    <Link href={`/predications/${sermon.id}`} className={`${cardBase} block no-underline`}>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-royal">
        {sermon.format === "video" ? "Vidéo" : "Audio"} · {sermon.chapelName}
      </p>
      <h3 className="mt-2 font-display text-lg text-royal">{sermon.title}</h3>
      <p className="mt-2 font-body text-sm text-slate">
        {sermon.preacher} — {new Date(sermon.date).toLocaleDateString("fr-FR")}
      </p>
    </Link>
  );
}

export function TestimonyCard({ testimony }: { testimony: Testimony }) {
  return (
    <Link href={`/temoignages/${testimony.id}`} className={`${cardBase} block no-underline`}>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold-700">
        {testimony.format} {testimony.chapelName ? `· ${testimony.chapelName}` : ""}
      </p>
      <h3 className="mt-2 font-display text-lg text-royal">{testimony.authorName}</h3>
      <p className="mt-2 font-body text-sm text-charcoal">{testimony.excerpt}</p>
    </Link>
  );
}

export function ConventionCard({ convention }: { convention: Convention }) {
  return (
    <Link href={`/conventions/${convention.slug}`} className={`${cardBase} block no-underline`}>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-crimson">
        {convention.status === "nouvelle" ? "À venir" : "Archive"}
      </p>
      <h3 className="mt-2 font-display text-xl text-royal">{convention.title}</h3>
      <p className="mt-1 font-body text-sm text-slate">{convention.location}</p>
      <p className="mt-3 font-body text-sm text-charcoal">
        {new Date(convention.startDate).toLocaleDateString("fr-FR")} —{" "}
        {new Date(convention.endDate).toLocaleDateString("fr-FR")}
      </p>
    </Link>
  );
}

export function BookCard({ book }: { book: Book }) {
  return (
    <div className={cardBase}>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold-700">
        Apôtre T. Beaudelaire
      </p>
      <h3 className="mt-2 font-display text-xl text-royal">{book.title}</h3>
      <p className="mt-2 font-body text-sm text-charcoal">{book.description}</p>
    </div>
  );
}

export function CampaignCard({ campaign }: { campaign: EvangelizationCampaign }) {
  return (
    <div className={cardBase}>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-crimson">
        {new Date(campaign.date).toLocaleDateString("fr-FR")}
      </p>
      <h3 className="mt-2 font-display text-xl text-royal">{campaign.title}</h3>
      <p className="mt-1 font-body text-sm text-slate">{campaign.location}</p>
      <p className="mt-3 font-body text-sm text-charcoal">{campaign.description}</p>
    </div>
  );
}
EOF

echo "→ app/clg/page.tsx"
cat > app/clg/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { WorldThread } from "@/components/ui/WorldThread";
import { ObjectiveCard } from "@/components/ui/ObjectiveCard";

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="1 Timothée 3.15"
        title="L'appui et la colonne de la vérité."
        subtitle="Avec Jésus, on peut recommencer et faire mieux."
      />

      <WorldThread className="text-gold" />

      <Section className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl">Genèse</h2>
          <p className="mt-4 font-body text-base leading-relaxed text-slate">
            Cette section présentera l&apos;histoire de la fondation de la CLG par l&apos;apôtre
            T. Beaudelaire — à rédiger avec l&apos;Église pour remplacer ce texte provisoire.
          </p>
        </div>
        <div>
          <h2 className="text-2xl">Vision</h2>
          <p className="mt-4 font-body text-base leading-relaxed text-slate">
            Cette section présentera la vision de la CLG — à rédiger avec l&apos;Église pour
            remplacer ce texte provisoire.
          </p>
        </div>
      </Section>

      <WorldThread className="text-gold" />

      <Section>
        <h2 className="text-2xl">Objectifs</h2>
        <p className="mt-3 max-w-xl font-body text-base text-slate">
          Les objectifs de la CLG, à court, moyen et long terme.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <ObjectiveCard label="Court terme" text="Objectif à préciser avec l'Église." accent="crimson" />
          <ObjectiveCard label="Moyen terme" text="Objectif à préciser avec l'Église." accent="royal" />
          <ObjectiveCard label="Long terme" text="Objectif à préciser avec l'Église." accent="gold" />
        </div>
      </Section>
    </>
  );
}
EOF

echo "→ app/chapelles/page.tsx"
cat > app/chapelles/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ChapelCard } from "@/components/content/Cards";
import { chapels } from "@/lib/mock/content";

export default function ChapelsPage() {
  return (
    <>
      <PageHero
        eyebrow="Chapelles"
        title="La CLG à travers le monde"
        subtitle="Chaque chapelle dispose de son propre espace : localisation, dirigeant, activités et prédications."
      />
      <Section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {chapels.map((chapel) => (
          <ChapelCard key={chapel.slug} chapel={chapel} />
        ))}
      </Section>
    </>
  );
}
EOF

echo "→ app/chapelles/[slug]/page.tsx"
cat > "app/chapelles/[slug]/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SermonCard } from "@/components/content/Cards";
import { chapels, sermons } from "@/lib/mock/content";

export default async function ChapelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapel = chapels.find((c) => c.slug === slug);
  if (!chapel) notFound();

  const chapelSermons = sermons.filter((s) => s.chapelSlug === slug);

  return (
    <>
      <PageHero
        eyebrow={`${chapel.country} — ${chapel.city}`}
        title={chapel.name}
        subtitle={`Dirigée par ${chapel.pastorName} · ${chapel.contact}`}
      />

      <Section>
        <h2 className="text-2xl">Prédications récentes</h2>
        {chapelSermons.length === 0 ? (
          <p className="mt-4 font-body text-sm text-slate">
            Aucune prédication publiée pour l&apos;instant.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {chapelSermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        )}
      </Section>

      <Section>
        <h2 className="text-2xl">Activités de la chapelle</h2>
        <p className="mt-4 font-body text-sm text-slate">
          Les activités locales (réunions, visites, projets) seront publiées ici par le pasteur.
        </p>
      </Section>
    </>
  );
}
EOF

echo "→ app/predications/page.tsx"
cat > app/predications/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SermonCard } from "@/components/content/Cards";
import { sermons } from "@/lib/mock/content";

export default function SermonsPage() {
  return (
    <>
      <PageHero
        eyebrow="Prédications"
        title="Prédications audio et vidéo"
        subtitle="Classées par chapelle, par pasteur et par date. Téléchargement disponible sur chaque fiche."
      />
      <Section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sermons.map((sermon) => (
          <SermonCard key={sermon.id} sermon={sermon} />
        ))}
      </Section>
    </>
  );
}
EOF

echo "→ app/predications/[id]/page.tsx"
cat > "app/predications/[id]/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { sermons } from "@/lib/mock/content";

export default async function SermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sermon = sermons.find((s) => s.id === id);
  if (!sermon) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${sermon.chapelName} · ${sermon.preacher}`}
        title={sermon.title}
        subtitle={new Date(sermon.date).toLocaleDateString("fr-FR", {
          day: "numeric", month: "long", year: "numeric",
        })}
      />
      <Section>
        <div className="flex aspect-video items-center justify-center rounded-sm border border-royal-100 bg-paper-dark">
          <p className="font-mono text-sm text-slate">
            Lecteur {sermon.format === "video" ? "vidéo" : "audio"} — à brancher sur le fichier média (S3 / R2)
          </p>
        </div>
        <div className="mt-6">
          <Button variant="primary">Télécharger la prédication</Button>
        </div>
      </Section>
    </>
  );
}
EOF

echo "→ app/temoignages/page.tsx"
cat > app/temoignages/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { TestimonyCard } from "@/components/content/Cards";
import { testimonies } from "@/lib/mock/content";

export default function TestimoniesPage() {
  return (
    <>
      <PageHero
        eyebrow="Témoignages"
        title="Ce que Dieu fait dans nos vies"
        subtitle="Texte, audio ou vidéo — chaque témoignage peut être commenté par la communauté."
      />
      <Section>
        <Button href="/temoignages/nouveau" variant="primary" className="mb-8">
          Partager mon témoignage
        </Button>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonies.map((testimony) => (
            <TestimonyCard key={testimony.id} testimony={testimony} />
          ))}
        </div>
      </Section>
    </>
  );
}
EOF

echo "→ app/temoignages/[id]/page.tsx"
cat > "app/temoignages/[id]/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { testimonies } from "@/lib/mock/content";

export default async function TestimonyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimony = testimonies.find((t) => t.id === id);
  if (!testimony) notFound();

  return (
    <>
      <PageHero
        eyebrow={testimony.chapelName ?? "Témoignage"}
        title={testimony.authorName}
        subtitle={new Date(testimony.date).toLocaleDateString("fr-FR")}
      />
      <Section>
        <p className="max-w-2xl font-body text-base leading-relaxed text-charcoal">
          {testimony.content}
        </p>
      </Section>

      <Section className="border-t border-royal-100">
        <h2 className="text-2xl">Commentaires</h2>
        <p className="mt-4 font-body text-sm text-slate">
          La modération et la publication des commentaires seront connectées à l&apos;API
          (permission : modération par le pasteur de la chapelle ou l&apos;apôtre).
        </p>
      </Section>
    </>
  );
}
EOF

echo "→ app/temoignages/nouveau/page.tsx"
cat > app/temoignages/nouveau/page.tsx << 'EOF'
"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const formats = [
  { value: "texte", label: "Texte" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Vidéo" },
] as const;

export default function NewTestimonyPage() {
  const [format, setFormat] = useState<(typeof formats)[number]["value"]>("texte");

  return (
    <>
      <PageHero eyebrow="Témoignages" title="Partager mon témoignage" />
      <Section>
        <form
          className="max-w-xl space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Formulaire à connecter à l'API (POST /api/testimonies).");
          }}
        >
          <div>
            <label className="font-body text-sm font-medium text-charcoal">Nom complet</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm"
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-charcoal">Format</label>
            <div className="mt-2 flex gap-3">
              {formats.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFormat(f.value)}
                  className={`rounded-sm border px-4 py-2 font-body text-sm transition-colors ${
                    format === f.value
                      ? "border-crimson bg-crimson text-paper"
                      : "border-royal-100 text-slate hover:border-royal"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {format === "texte" ? (
            <div>
              <label className="font-body text-sm font-medium text-charcoal">Mon témoignage</label>
              <textarea
                required
                rows={6}
                className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm"
              />
            </div>
          ) : (
            <div>
              <label className="font-body text-sm font-medium text-charcoal">
                Fichier {format === "audio" ? "audio" : "vidéo"}
              </label>
              <input
                type="file"
                accept={format === "audio" ? "audio/*" : "video/*"}
                required
                className="mt-1 w-full font-body text-sm"
              />
            </div>
          )}

          <Button type="submit" variant="primary">
            Envoyer mon témoignage
          </Button>
        </form>
      </Section>
    </>
  );
}
EOF

echo "→ app/evangelisation/page.tsx"
cat > app/evangelisation/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { CampaignCard } from "@/components/content/Cards";
import { campaigns } from "@/lib/mock/content";

export default function EvangelizationPage() {
  return (
    <>
      <PageHero
        eyebrow="Évangélisation"
        title="Croisades et campagnes"
        subtitle="Les croisades d'évangélisation organisées par la CLG à travers les chapelles."
      />
      <Section className="grid gap-6 md:grid-cols-2">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </Section>
    </>
  );
}
EOF

echo "→ app/ouvrages/page.tsx"
cat > app/ouvrages/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { BookCard } from "@/components/content/Cards";
import { books } from "@/lib/mock/content";

export default function BooksPage() {
  return (
    <>
      <PageHero
        eyebrow="Ouvrages"
        title="Les écrits de l'apôtre T. Beaudelaire"
      />
      <Section className="grid gap-6 md:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </Section>
    </>
  );
}
EOF

echo "→ app/conventions/page.tsx"
cat > app/conventions/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ConventionCard } from "@/components/content/Cards";
import { conventions } from "@/lib/mock/content";

export default function ConventionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Conventions"
        title="Anciennes et nouvelles conventions"
        subtitle="Programme, inscriptions, témoignages et chorales pour chaque édition."
      />
      <Section className="grid gap-6 md:grid-cols-2">
        {conventions.map((convention) => (
          <ConventionCard key={convention.slug} convention={convention} />
        ))}
      </Section>
    </>
  );
}
EOF

echo "→ app/conventions/[slug]/page.tsx"
cat > "app/conventions/[slug]/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { conventions } from "@/lib/mock/content";

export default async function ConventionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const convention = conventions.find((c) => c.slug === slug);
  if (!convention) notFound();

  return (
    <>
      <PageHero
        eyebrow={convention.location}
        title={convention.title}
        subtitle={`${new Date(convention.startDate).toLocaleDateString("fr-FR")} — ${new Date(
          convention.endDate
        ).toLocaleDateString("fr-FR")}`}
      />

      <Section>
        <h2 className="text-2xl">Programme</h2>
        <ol className="mt-4 space-y-2 font-body text-base text-charcoal">
          {convention.program.map((item, i) => (
            <li key={i} className="border-l-2 border-gold pl-4">{item}</li>
          ))}
        </ol>
      </Section>

      {convention.status === "nouvelle" && (
        <Section className="flex flex-wrap gap-4">
          <Button href={`/conventions/${convention.slug}/inscription`} variant="primary">
            S&apos;inscrire
          </Button>
          <Button href={`/conventions/${convention.slug}/temoignages`} variant="secondary">
            Témoignages de convention
          </Button>
          <Button href={`/conventions/${convention.slug}/chorales`} variant="secondary">
            Chorales
          </Button>
        </Section>
      )}
    </>
  );
}
EOF

echo "→ app/conventions/[slug]/inscription/page.tsx"
cat > "app/conventions/[slug]/inscription/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { conventions } from "@/lib/mock/content";

export default async function ConventionRegistrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const convention = conventions.find((c) => c.slug === slug);
  if (!convention) notFound();

  return (
    <>
      <PageHero eyebrow={convention.title} title="Inscription" />
      <Section>
        <form className="max-w-xl space-y-6">
          <div>
            <label className="font-body text-sm font-medium text-charcoal">Nom complet</label>
            <input type="text" required className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal">Chapelle</label>
            <input type="text" required className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal">Téléphone</label>
            <input type="tel" required className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm" />
          </div>
          <Button variant="primary">Confirmer mon inscription</Button>
        </form>
      </Section>
    </>
  );
}
EOF

echo "→ app/conventions/[slug]/temoignages/page.tsx"
cat > "app/conventions/[slug]/temoignages/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { TestimonyCard } from "@/components/content/Cards";
import { conventions, testimonies } from "@/lib/mock/content";

export default async function ConventionTestimoniesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const convention = conventions.find((c) => c.slug === slug);
  if (!convention) notFound();

  return (
    <>
      <PageHero
        eyebrow={convention.title}
        title="Témoignages de convention"
        subtitle="Pour ceux qui n'ont pas pu témoigner sur place faute de temps."
      />
      <Section>
        <Button variant="primary" className="mb-8">Enregistrer mon témoignage</Button>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonies.map((testimony) => (
            <TestimonyCard key={testimony.id} testimony={testimony} />
          ))}
        </div>
      </Section>
    </>
  );
}
EOF

echo "→ app/conventions/[slug]/chorales/page.tsx"
cat > "app/conventions/[slug]/chorales/page.tsx" << 'EOF'
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { conventions, choirSongs } from "@/lib/mock/content";

export default async function ConventionChoirsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const convention = conventions.find((c) => c.slug === slug);
  if (!convention) notFound();

  return (
    <>
      <PageHero eyebrow={convention.title} title="Chants des chorales" />
      <Section className="grid gap-6 md:grid-cols-2">
        {choirSongs.map((song) => (
          <div key={song.id} className="rounded-sm border border-royal-100 bg-paper-light p-6 shadow-sm">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-gold-700">{song.chapelName}</p>
            <h3 className="mt-2 font-display text-lg text-royal">{song.title}</h3>
            <p className="mt-2 font-body text-sm text-slate">
              {song.format === "video" ? "Vidéo disponible" : song.lyricsExcerpt}
            </p>
          </div>
        ))}
      </Section>
    </>
  );
}
EOF

echo "→ app/dons/page.tsx"
cat > app/dons/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const amounts = [5000, 10000, 25000, 50000];

export default function DonationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Dons"
        title="Soutenir l'œuvre de la CLG"
        subtitle="Chaque don contribue à l'évangélisation, aux conventions et à la vie des chapelles à travers le monde."
      />
      <Section>
        <div className="max-w-md rounded-sm border border-royal-100 bg-paper-light p-8 shadow-sm">
          <p className="font-body text-sm font-medium text-charcoal">Montant (FCFA)</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {amounts.map((amount) => (
              <button
                key={amount}
                className="rounded-sm border border-royal-100 px-4 py-3 font-body text-sm text-royal transition-colors hover:border-crimson hover:text-crimson"
              >
                {amount.toLocaleString("fr-FR")}
              </button>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs text-slate">
            Le moyen de paiement (Mobile Money, carte bancaire...) sera branché une fois le
            prestataire choisi avec l&apos;Église.
          </p>
          <Button variant="primary" className="mt-6 w-full">Faire un don</Button>
        </div>
      </Section>
    </>
  );
}
EOF

echo "→ app/contact/page.tsx"
cat > app/contact/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Nous contacter" />
      <Section>
        <form className="max-w-xl space-y-6">
          <div>
            <label className="font-body text-sm font-medium text-charcoal">Nom complet</label>
            <input type="text" required className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal">E-mail</label>
            <input type="email" required className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal">Message</label>
            <textarea rows={5} required className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm" />
          </div>
          <Button variant="primary">Envoyer</Button>
        </form>
      </Section>
    </>
  );
}
EOF

echo "→ app/login/page.tsx"
cat > app/login/page.tsx << 'EOF'
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <>
      <PageHero eyebrow="Connexion" title="Se connecter" />
      <Section>
        <form className="max-w-sm space-y-6">
          <div>
            <label className="font-body text-sm font-medium text-charcoal">E-mail</label>
            <input type="email" required className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm" />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-charcoal">Mot de passe</label>
            <input type="password" required className="mt-1 w-full rounded-sm border border-royal-100 px-4 py-2 font-body text-sm" />
          </div>
          <p className="font-mono text-xs text-slate">
            Authentification à connecter à l&apos;API Django (JWT).
          </p>
          <Button variant="primary" className="w-full">Se connecter</Button>
        </form>
      </Section>
    </>
  );
}
EOF

echo "✓ Toutes les pages ont été créées."
