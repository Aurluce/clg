import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonies } from "@/lib/mock/content";

export default async function TestimonyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimony = testimonies.find((t) => t.id === id);
  if (!testimony) notFound();

  return (
    <>
      <PageHero
        eyebrow={testimony.chapelName ?? "Témoignage"}
        title={testimony.authorName}
        subtitle={`Publié le ${new Date(testimony.date).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })} · Format : ${testimony.format}`}
      />

      {/* Contenu du témoignage */}
      <Section>
        <figure className="relative mx-auto max-w-3xl">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-2 -top-10 select-none font-display text-[7rem] leading-none text-gold-100 md:-left-10"
          >
            “
          </span>

          <blockquote className="relative">
            <p className="font-display text-xl font-medium italic leading-relaxed text-charcoal md:text-2xl">
              {testimony.content}
            </p>
          </blockquote>

          <figcaption className="mt-8 flex items-center gap-4 border-t border-royal-100 pt-6">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-royal font-display text-lg font-bold text-paper"
            >
              {testimony.authorName.charAt(0)}
            </span>

            <div>
              <p className="font-display text-base font-semibold text-royal">
                {testimony.authorName}
              </p>

              {testimony.chapelName && (
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-light">
                  {testimony.chapelName}
                </p>
              )}
            </div>
          </figcaption>
        </figure>
      </Section>

      {/* Commentaires */}
      <Section className="border-t border-royal-100 bg-paper-light">
        <SectionHeading
          eyebrow="Communauté"
          title="Commentaires"
          lead="Encouragez l'auteur en partageant votre soutien après modération."
        />

        <div className="mt-8 rounded-xl border-2 border-dashed border-royal-100 bg-paper px-8 py-14 text-center">
          <p className="font-display text-lg font-semibold text-royal">
            Bientôt disponible
          </p>

          <p className="mx-auto mt-2 max-w-md font-body text-sm leading-relaxed text-slate">
            La modération et la publication des commentaires seront connectées à l'API
            (permission : modération par le pasteur de la chapelle ou l'apôtre).
          </p>
        </div>
      </Section>
    </>
  );
}