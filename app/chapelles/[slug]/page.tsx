import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { SermonCard } from "@/components/content/Cards";
import { chapels, sermons } from "@/lib/mock/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapel = chapels.find((c) => c.slug === slug);

  return {
    title: chapel ? `${chapel.name} — CLG` : "Chapelle — CLG",
    description: chapel
      ? `Découvrez la ${chapel.name} à ${chapel.city}, dirigée par ${chapel.pastorName}.`
      : undefined,
  };
}

export default async function ChapelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapel = chapels.find((c) => c.slug === slug);
  if (!chapel) notFound();

  const chapelSermons = sermons.filter((s) => s.chapelSlug === slug);

  const infos = [
    { label: "Ville", value: `${chapel.city}, ${chapel.country}` },
    { label: "Pasteur", value: chapel.pastorName },
    { label: "Contact", value: chapel.contact },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${chapel.country} — ${chapel.city}`}
        title={chapel.name}
        subtitle="Bienvenue dans notre chapelle : retrouvez ici nos prédications et nos activités locales."
      />

      {/* Cartes d'information */}
      <Section className="pb-0">
        <dl className="grid gap-px overflow-hidden rounded-xl border border-royal-100 bg-royal-100 shadow-sm sm:grid-cols-3">
          {infos.map((info) => (
            <div key={info.label} className="bg-paper-light px-6 py-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-light">
                {info.label}
              </dt>
              <dd className="mt-1.5 font-display text-base font-semibold text-royal">
                {info.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Prédications */}
      <Section>
        <SectionHeading
          eyebrow="Prédications"
          title="Prédications récentes"
        />

        {chapelSermons.length === 0 ? (
          <div className="mt-8 rounded-xl border-2 border-dashed border-royal-100 bg-paper-light px-8 py-14 text-center">
            <p className="font-display text-lg font-semibold text-royal">
              Aucune prédication publiée pour l'instant
            </p>

            <p className="mx-auto mt-2 max-w-md font-body text-sm leading-relaxed text-slate">
              Les prédications de cette chapelle apparaîtront ici dès leur publication par le
              pasteur.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {chapelSermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>
        )}
      </Section>

      {/* Activités */}
      <Section className="border-t border-royal-100 bg-paper-light">
        <SectionHeading
          eyebrow="Vie locale"
          title="Activités de la chapelle"
          lead="Réunions de prière, visites, projets communautaires : suivez la vie de la chapelle au quotidien."
        />

        <div className="mt-8 rounded-xl border-2 border-dashed border-royal-100 bg-paper px-8 py-14 text-center">
          <p className="font-display text-lg font-semibold text-royal">
            Bientôt disponible
          </p>

          <p className="mx-auto mt-2 max-w-md font-body text-sm leading-relaxed text-slate">
            Les activités locales seront publiées ici par le pasteur de la chapelle.
          </p>
        </div>
      </Section>

      <CTABand
        eyebrow="Vous êtes les bienvenus"
        title={`Rejoignez-nous à la ${chapel.name.replace("CLG ", "")}`}
        text={`Rendez-vous à ${chapel.city}. Contactez le pasteur ${chapel.pastorName.replace("Pasteur ", "")} pour plus d'informations.`}
        primaryLabel="Voir toutes les chapelles"
        primaryHref="/chapelles"
        secondaryLabel="Nous contacter"
        secondaryHref="/contact"
      />
    </>
  );
}