import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { sermons } from "@/lib/mock/content";

export default async function SermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sermon = sermons.find((s) => s.id === id);
  if (!sermon) notFound();

  const isVideo = sermon.format === "video";

  return (
    <>
      <PageHero
        eyebrow={`${sermon.chapelName} · ${sermon.preacher}`}
        title={sermon.title}
        subtitle={new Date(sermon.date).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      />

      <Section>
        {/* Lecteur média */}
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-royal-100 bg-royal-900 shadow-md">
          <div
            aria-hidden="true"
            className="bg-dots-lg pointer-events-none absolute inset-0 text-paper opacity-[0.06]"
          />

          <div className="relative flex flex-col items-center gap-5 px-6 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-royal-900 shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer">
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-8 w-8" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
            </span>

            <p className="font-mono text-xs uppercase tracking-[0.2em] text-royal-100">
              Lecteur {isVideo ? "vidéo" : "audio"} — à brancher sur le fichier média (S3 / R2)
            </p>
          </div>
        </div>

        {/* Métadonnées */}
        <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-royal-100 bg-royal-100 shadow-sm sm:grid-cols-3">
          {[
            { label: "Prédicateur", value: sermon.preacher },
            { label: "Chapelle", value: sermon.chapelName },
            { label: "Format", value: isVideo ? "Vidéo" : "Audio" },
          ].map((meta) => (
            <div key={meta.label} className="bg-paper-light px-6 py-5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate-light">
                {meta.label}
              </dt>
              <dd className="mt-1 font-display text-base font-semibold text-royal">
                {meta.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="primary">
            Télécharger la prédication
            <span aria-hidden="true">↓</span>
          </Button>

          <Button href="/predications" variant="secondary">
            ← Toutes les prédications
          </Button>
        </div>

        <p className="mt-4 font-mono text-xs leading-relaxed text-slate-light">
          Le téléchargement sera activé une fois le stockage média connecté.
        </p>
      </Section>
    </>
  );
}