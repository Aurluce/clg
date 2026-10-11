import type { Metadata } from "next";
import Link from "next/link";
import { ChapelMapSection } from "@/components/content/ChapelMapSection";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";

function readableSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase("fr-FR") + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = readableSlug(slug);

  return {
    title: `${name} — Chapelle CLG`,
    description: `Carte, itinéraire, coordonnées et activités de la chapelle ${name}.`,
  };
}

export default async function ChapelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapelName = readableSlug(slug);

  return (
    <>
      <PageHero
        eyebrow="Chapelle CLG"
        title={chapelName}
        subtitle="Retrouvez sa position exacte, ses coordonnées, ses activités et les indications pour vous y rendre."
      />

      <Section>
        <div className="mb-7">
          <Link href="/chapelles" className="text-sm font-semibold text-royal-700 hover:underline">
            ← Toutes les chapelles
          </Link>
          <h2 className="mt-5 font-display text-2xl font-semibold text-royal">Carte et informations de la chapelle</h2>
          <p className="mt-2 text-sm leading-6 text-slate">
            La carte centre automatiquement cette chapelle. Autorisez la géolocalisation pour calculer votre itinéraire piéton.
          </p>
        </div>
        <ChapelMapSection key={slug} initialSelectedSlug={slug} showChapelSelector={false} />
      </Section>
    </>
  );
}
