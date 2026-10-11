import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SermonDetail } from "@/components/content/SermonDetail";

export default async function SermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <PageHero
        eyebrow="Bibliothèque de prédications CLG"
        title="Prédication"
        subtitle="Écoutez, regardez ou lisez le message publié par nos chapelles."
      />
      <Section>
        <SermonDetail identifier={id} />
      </Section>
    </>
  );
}
