import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { BookCard } from "@/components/content/Cards";
import { books } from "@/lib/mock/content";

export const metadata = {
  title: "Ouvrages — CLG",
  description:
    "Découvrez les ouvrages de l'apôtre T. Beaudelaire, fondateur de la Church of the Living God.",
};

export default function BooksPage() {
  return (
    <>
      <PageHero
        eyebrow="Ouvrages"
        title="Les écrits de l'apôtre T. Beaudelaire"
        subtitle="Des enseignements qui fondent et nourrissent la foi de l'Église, chapelle après chapelle."
      />

      <Section>
        <SectionHeading
          eyebrow={`${books.length} ouvrages`}
          title="Une bibliothèque pour grandir dans la foi"
          lead="Chaque ouvrage approfondit un pilier du message de la CLG : la vérité, le recommencement et la vie d'Église."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </Section>

      <CTABand
        eyebrow="Ouvrages CLG"
        title="Approfondir le message de la CLG"
        text="Les ouvrages sont disponibles auprès des chapelles. Contactez-nous pour en obtenir un exemplaire."
        primaryLabel="Nous contacter"
        primaryHref="/contact"
        secondaryLabel="Écouter les prédications"
        secondaryHref="/predications"
      />
    </>
  );
}