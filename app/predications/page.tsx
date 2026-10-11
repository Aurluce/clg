import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { SermonLibrary } from "@/components/content/SermonLibrary";

export const metadata = {
  title: "Prédications — CLG",
  description:
    "Écoutez et téléchargez les prédications audio et vidéo de la Church of the Living God, classées par chapelle et par pasteur.",
};

export default function SermonsPage() {
  return (
    <>
      <PageHero
        eyebrow="Prédications"
        title="Prédications audio et vidéo"
        subtitle="Classées par chapelle, par pasteur et par date. Téléchargement disponible sur chaque fiche."
      />

      <Section>
        <SectionHeading
          eyebrow="Bibliothèque CLG"
          title="Toutes les prédications"
          lead="Écoutez les audios, regardez les vidéos ou lisez les messages publiés par nos chapelles. Filtrez par format, chapelle ou recherche."
        />
        <div className="mt-8">
          <SermonLibrary />
        </div>
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