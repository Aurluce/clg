import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { TestimonyCard } from "@/components/content/Cards";
import { conventions, testimonies } from "@/lib/mock/content";

export default async function ConventionTestimoniesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const convention = conventions.find((c) => c.slug === slug);
  if (!convention) notFound();

  return (
    <>
      <PageHero
        eyebrow={convention.title}
        title="Témoignages de convention"
        subtitle="Pour ceux qui n'ont pas pu témoigner sur place faute de temps."
      />

      <Section>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={`${testimonies.length} témoignages`}
            title="Ce que Dieu a fait pendant ces jours"
            lead="Chaque témoignage recueilli lors de la convention est une encouragement pour toute l'Église."
          />

          <Button href="/temoignages/nouveau" variant="primary" className="shrink-0">
            Enregistrer mon témoignage
            <span aria-hidden="true">→</span>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonies.map((testimony) => (
            <TestimonyCard key={testimony.id} testimony={testimony} />
          ))}
        </div>
      </Section>
    </>
  );
}