import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorldThread } from "@/components/ui/WorldThread";
import { ObjectiveCard } from "@/components/ui/ObjectiveCard";
import { CTABand } from "@/components/ui/CTABand";

export const metadata = {
  title: "La CLG — Church of the Living God",
  description:
    "Découvrez la Church of the Living God : sa genèse, sa vision et ses objectifs, fondés sur 1 Timothée 3.15.",
};

const chapters = [
  {
    index: "01",
    title: "Genèse",
    text: "Cette section présentera l'histoire de la fondation de la CLG par l'apôtre T. Beaudelaire — à rédiger avec l'Église pour remplacer ce texte provisoire.",
  },
  {
    index: "02",
    title: "Vision",
    text: "Cette section présentera la vision de la CLG — à rédiger avec l'Église pour remplacer ce texte provisoire.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="1 Timothée 3.15"
        title="L'appui et la colonne de la vérité."
        subtitle="Avec Jésus, on peut recommencer et faire mieux."
      />

      {/* Citation fondatrice */}
      <Section className="pb-0">
        <figure className="relative mx-auto max-w-3xl text-center">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 select-none font-display text-[8rem] leading-none text-gold-100"
          >
            “
          </span>

          <blockquote className="relative">
            <p className="font-display text-2xl font-medium italic leading-relaxed text-royal md:text-3xl">
              L'Église du Dieu vivant, colonne et appui de la vérité.
            </p>
          </blockquote>

          <figcaption className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-gold-700">
            1 Timothée 3.15
          </figcaption>
        </figure>
      </Section>

      <WorldThread className="mt-16 text-gold md:mt-20" />

      {/* Genèse & Vision */}
      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          {chapters.map((chapter) => (
            <article key={chapter.index} className="relative border-t-2 border-royal-100 pt-8">
              <span
                aria-hidden="true"
                className="absolute -top-5 left-0 select-none bg-paper pr-4 font-display text-5xl font-bold text-gold"
              >
                {chapter.index}
              </span>

              <h2 className="relative mt-4 font-display text-2xl font-semibold text-royal md:text-3xl">
                {chapter.title}
              </h2>

              <p className="mt-4 font-body text-base leading-relaxed text-slate">
                {chapter.text}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/* Objectifs */}
      <Section className="border-t border-royal-100 bg-paper-light">
        <SectionHeading
          eyebrow="Objectifs"
          title="Où nous allons"
          lead="Les objectifs de la CLG, à court, moyen et long terme."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ObjectiveCard label="Court terme" text="Objectif à préciser avec l'Église." accent="crimson" />
          <ObjectiveCard label="Moyen terme" text="Objectif à préciser avec l'Église." accent="royal" />
          <ObjectiveCard label="Long terme" text="Objectif à préciser avec l'Église." accent="gold" />
        </div>
      </Section>

      <CTABand
        eyebrow="Faites partie de l'histoire"
        title="Rejoignez une chapelle près de chez vous"
        text="La CLG, c'est d'abord des hommes et des femmes réunis autour de la Parole. Venez comme vous êtes."
        primaryLabel="Voir les chapelles"
        primaryHref="/chapelles"
        secondaryLabel="Nous contacter"
        secondaryHref="/contact"
      />
    </>
  );
}