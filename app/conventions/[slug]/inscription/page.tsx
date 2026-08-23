import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ConventionRegistrationForm } from "@/components/content/ConventionRegistrationForm";
import { conventions } from "@/lib/mock/content";

export default async function ConventionRegistrationPage({
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
        eyebrow="Inscription"
        title={convention.title}
        subtitle="Réservez votre place pour vivre ces jours de louange, d'enseignement et de communion fraternelle."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Formulaire (composant client) */}
          <ConventionRegistrationForm />

          {/* Récapitulatif de l'événement */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-xl bg-royal p-8 text-paper shadow-md">
              <div
                aria-hidden="true"
                className="bg-dots-lg pointer-events-none absolute inset-0 text-paper opacity-[0.07]"
              />

              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                  L'événement
                </p>

                <h2 className="mt-3 font-display text-2xl font-semibold leading-snug">
                  {convention.title}
                </h2>

                <dl className="mt-7 space-y-5">
                  <div className="border-l-2 border-gold/60 pl-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-royal-100">
                      Dates
                    </dt>
                    <dd className="mt-1 font-body text-sm">
                      {new Date(convention.startDate).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" — "}
                      {new Date(convention.endDate).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </dd>
                  </div>

                  <div className="border-l-2 border-gold/60 pl-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-royal-100">
                      Lieu
                    </dt>
                    <dd className="mt-1 font-body text-sm">{convention.location}</dd>
                  </div>

                  <div className="border-l-2 border-gold/60 pl-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-royal-100">
                      Programme
                    </dt>
                    <dd className="mt-1 font-body text-sm leading-relaxed">
                      {convention.program.slice(0, 3).join(" · ")}…
                    </dd>
                  </div>
                </dl>

                <p className="mt-8 border-t border-paper/20 pt-5 font-body text-xs leading-relaxed text-royal-100">
                  L'entrée est libre et gratuite. L'inscription nous aide simplement à
                  préparer l'accueil.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}