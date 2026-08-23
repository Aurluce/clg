import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { SermonCard } from "@/components/content/Cards";
import { sermons } from "@/lib/mock/content";

export const metadata = {
  title: "Prédications — CLG",
  description:
    "Écoutez et téléchargez les prédications audio et vidéo de la Church of the Living God, classées par chapelle et par pasteur.",
};

export default function SermonsPage() {
  const [featured, ...rest] = sermons;

  return (
    <>
      <PageHero
        eyebrow="Prédications"
        title="Prédications audio et vidéo"
        subtitle="Classées par chapelle, par pasteur et par date. Téléchargement disponible sur chaque fiche."
      />

      <Section>
        <SectionHeading
          eyebrow={`${sermons.length} prédications`}
          title="À la une"
          lead="La dernière prédication publiée par nos chapelles."
        />

        {/* Mise en avant de la dernière prédication */}
        <a
          href={`/predications/${featured.id}`}
          className="group relative mt-8 flex flex-col gap-6 overflow-hidden rounded-xl border border-royal-100 bg-paper-light p-7 no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-royal-300 hover:shadow-lg hover:shadow-royal-100/60 md:flex-row md:items-center md:gap-10 md:p-9"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-crimson via-crimson-300 to-gold"
          />

          {/* Pastille lecture */}
          <span
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-royal text-paper shadow-md transition-transform duration-300 group-hover:scale-105"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-crimson">
              Dernière prédication · {featured.chapelName}
            </p>

            <h3 className="mt-2 font-display text-2xl font-semibold leading-snug text-royal transition-colors group-hover:text-royal-700 md:text-3xl">
              {featured.title}
            </h3>

            <p className="mt-3 font-body text-sm text-slate">
              <span className="font-medium text-charcoal">{featured.preacher}</span>
              {" · "}
              {new Date(featured.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {featured.format === "video" ? "Vidéo" : "Audio"}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="hidden shrink-0 font-display text-5xl text-royal-100 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold md:block"
          >
            →
          </span>
        </a>

        {/* Autres prédications */}
        {rest.length > 0 && (
          <>
            <h2 className="mt-14 font-display text-2xl font-semibold text-royal">
              Précédentes prédications
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          </>
        )}
      </Section>

      <CTABand
        eyebrow="Restez connecté"
        title="Ne manquez aucune nouvelle prédication"
        text="Chaque semaine, les chapelles publient leurs prédications sur leur espace dédié."
        primaryLabel="Explorer les chapelles"
        primaryHref="/chapelles"
        secondaryLabel="Partager un témoignage"
        secondaryHref="/temoignages/nouveau"
      />
    </>
  );
}