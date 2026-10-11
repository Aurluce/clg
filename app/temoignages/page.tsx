import { TestimonyGallery } from "@/components/content/TestimonyGallery";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";

export const metadata = {
  title: "Témoignages — CLG",
  description: "Lisez et partagez les témoignages texte, audio et vidéo de la communauté CLG.",
};

export default function TestimoniesPage() {
  return (
    <>
      <PageHero
        eyebrow="Témoignages"
        title="Ce que Dieu fait dans nos vies"
        subtitle="Découvrez les récits publiés par la communauté et partagez le vôtre après validation."
      />
      <Section>
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-royal">Des vies transformées par l’Évangile</h2>
          <p className="mt-2 text-sm leading-6 text-slate">Parcourez les témoignages approuvés. Les vidéos et les audios sont lisibles directement sur la page.</p>
        </div>
        <TestimonyGallery />
      </Section>
    </>
  );
}
