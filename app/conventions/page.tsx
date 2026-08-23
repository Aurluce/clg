import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { ConventionCard } from "@/components/content/Cards";
import { conventions } from "@/lib/mock/content";

export const metadata = {
  title: "Conventions — CLG",
  description:
    "Les conventions nationales de la Church of the Living God : programme, inscriptions, témoignages et chorales.",
};

export default function ConventionsPage() {
  const upcoming = conventions.filter((c) => c.status === "nouvelle");
  const archives = conventions.filter((c) => c.status !== "nouvelle");

  return (
    <>
      <PageHero
        eyebrow="Conventions"
        title="Anciennes et nouvelles conventions"
        subtitle="Programme, inscriptions, témoignages et chorales pour chaque édition."
      />

      {upcoming.length > 0 && (
        <Section>
          <SectionHeading
            eyebrow="Prochaine édition"
            title="Préparez-vous à nous rejoindre"
            lead="Inscriptions ouvertes : réservez votre place pour vivre ces jours de louange, d'enseignement et de communion fraternelle."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {upcoming.map((convention) => (
              <ConventionCard key={convention.slug} convention={convention} />
            ))}
          </div>
        </Section>
      )}

      {archives.length > 0 && (
        <Section className="border-t border-royal-100 bg-paper-light">
          <SectionHeading eyebrow="Archives" title="Éditions précédentes" />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {archives.map((convention) => (
              <ConventionCard key={convention.slug} convention={convention} />
            ))}
          </div>
        </Section>
      )}

      <CTABand
        eyebrow="Conventions CLG"
        title="Des moments forts de communion et d'enseignement"
        text="Chaque année, les fidèles de toutes les chapelles se réunissent pour une convention nationale inoubliable."
        primaryLabel="Soutenir les conventions"
        primaryHref="/dons"
        secondaryLabel="Nous contacter"
        secondaryHref="/contact"
      />
    </>
  );
}