import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { TestimonyCard } from "@/components/content/Cards";
import { testimonies } from "@/lib/mock/content";

export const metadata = {
  title: "Témoignages — CLG",
  description:
    "Lisez et partagez les témoignages des fidèles de la Church of the Living God : textes, audios et vidéos.",
};

export default function TestimoniesPage() {
  return (
    <>
      <PageHero
        eyebrow="Témoignages"
        title="Ce que Dieu fait dans nos vies"
        subtitle="Texte, audio ou vidéo — chaque témoignage peut être commenté par la communauté."
      />

      <Section>
        <SectionHeading
          eyebrow={`${testimonies.length} témoignages`}
          title="Des vies transformées par l'Évangile"
          lead="Chaque histoire est unique. Chaque témoignage est une encouragement pour toute l'Église."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonies.map((testimony) => (
            <TestimonyCard key={testimony.id} testimony={testimony} />
          ))}
        </div>
      </Section>

      <CTABand
        eyebrow="Votre histoire compte"
        title="Dieu a fait quelque chose pour vous ?"
        text="Partagez votre témoignage pour encourager des milliers de fidèles à travers le monde."
        primaryLabel="Partager mon témoignage"
        primaryHref="/temoignages/nouveau"
        secondaryLabel="Découvrir la CLG"
        secondaryHref="/clg"
      />
    </>
  );
}