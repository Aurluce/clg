import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { conventions } from "@/lib/mock/content";

export default async function ConventionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const convention = conventions.find((c) => c.slug === slug);
  if (!convention) notFound();

  return (
    <>
      <PageHero
        eyebrow={convention.location}
        title={convention.title}
        subtitle={`${new Date(convention.startDate).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })} — ${new Date(convention.endDate).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`}
      >
        <span
          className={[
            "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em]",
            convention.status === "nouvelle"
              ? "bg-crimson-100 text-crimson-700"
              : "bg-paper-dark text-slate",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "h-1.5 w-1.5 rounded-full",
              convention.status === "nouvelle" ? "bg-crimson animate-pulse" : "bg-slate-light",
            ].join(" ")}
          />
          {convention.status === "nouvelle" ? "Inscriptions ouvertes" : "Édition passée"}
        </span>
      </PageHero>

      {/* Programme */}
      <Section>
        <SectionHeading
          eyebrow="Programme"
          title="Le déroulé de la convention"
          lead="Quatre jours pour louer Dieu, recevoir l'enseignement de l'apôtre et témoigner de ses bienfaits."
        />

        <ol className="relative mt-10 space-y-0">
          {convention.program.map((item, i) => (
            <li key={i} className="relative flex gap-6 pb-10 last:pb-0">
              {/* Ligne verticale */}
              {i < convention.program.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-gradient-to-b from-gold to-royal-100"
                />
              )}

              {/* Numéro */}
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold bg-gold-100 font-display text-sm font-bold text-gold-700 shadow-sm"
              >
                {i + 1}
              </span>

              <div className="pt-1.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-light">
                  Étape {i + 1}
                </p>

                <p className="mt-1 font-display text-lg font-semibold leading-snug text-royal md:text-xl">
                  {item}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Actions */}
      {convention.status === "nouvelle" ? (
        <Section className="border-t border-royal-100 bg-paper-light">
          <SectionHeading
            eyebrow="Participez"
            title="Rejoignez la convention"
            lead="Inscrivez-vous dès maintenant, partagez votre témoignage ou découvrez les chants des chorales."
          />

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={`/conventions/${convention.slug}/inscription`} variant="primary">
              S'inscrire
              <span aria-hidden="true">→</span>
            </Button>

            <Button href={`/conventions/${convention.slug}/temoignages`} variant="secondary">
              Témoignages de convention
            </Button>

            <Button href={`/conventions/${convention.slug}/chorales`} variant="secondary">
              Chorales
            </Button>
          </div>
        </Section>
      ) : (
        <Section className="border-t border-royal-100 bg-paper-light">
          <SectionHeading
            eyebrow="Archives"
            title="Revivre cette édition"
            lead="Retrouvez les témoignages et les chants des chorales de cette édition passée."
          />

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href={`/conventions/${convention.slug}/temoignages`} variant="secondary">
              Témoignages de convention
            </Button>

            <Button href={`/conventions/${convention.slug}/chorales`} variant="secondary">
              Chorales
            </Button>
          </div>
        </Section>
      )}
    </>
  );
}