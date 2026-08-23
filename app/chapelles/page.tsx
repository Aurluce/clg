import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { ChapelCard } from "@/components/content/Cards";
import { chapels } from "@/lib/mock/content";

export const metadata = {
  title: "Chapelles — CLG",
  description:
    "Retrouvez toutes les chapelles de la Church of the Living God à travers le monde : localisation, dirigeant et activités.",
};

export default function ChapelsPage() {
  return (
    <>
      <PageHero
        eyebrow="Chapelles"
        title="La CLG à travers le monde"
        subtitle="Chaque chapelle dispose de son propre espace : localisation, dirigeant, activités et prédications."
      />

      <Section>
        <SectionHeading
          eyebrow={`${chapels.length} chapelles`}
          title="Trouvez la chapelle la plus proche de vous"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chapels.map((chapel) => (
            <ChapelCard key={chapel.slug} chapel={chapel} />
          ))}
        </div>
      </Section>

      <CTABand
        eyebrow="Votre ville n'y est pas ?"
        title="Aidez-nous à planter une nouvelle chapelle"
        text="L'implantation de nouvelles chapelles est au cœur de la vision de la CLG. Contactez-nous pour en parler."
        primaryLabel="Nous contacter"
        primaryHref="/contact"
        secondaryLabel="Soutenir l'œuvre"
        secondaryHref="/dons"
      />
    </>
  );
}