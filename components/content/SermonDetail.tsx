"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Sermon } from "@/types/content";

export function SermonDetail({ identifier }: { identifier: string }) {
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api.content.sermon(identifier).then(
      (data) => {
        if (active) setSermon(data);
      },
      (requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Impossible de charger cette prédication.");
      },
    ).finally(() => {
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [identifier]);

  if (isLoading) {
    return <section role="status" className="rounded-2xl border border-royal-100 bg-white p-10 text-center text-sm text-slate">Chargement de la prédication…</section>;
  }

  if (error || !sermon) {
    return (
      <section className="rounded-2xl border border-crimson-100 bg-white p-8 text-center">
        <h2 className="font-display text-xl font-semibold text-royal">Prédication indisponible</h2>
        <p role="alert" className="mt-3 text-sm text-crimson-700">{error ?? "Cette prédication n'existe pas ou n'est pas publiée."}</p>
        <Link href="/predications" className="mt-5 inline-flex rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white">Toutes les prédications</Link>
      </section>
    );
  }

  const format = sermon.format === "video" ? "Vidéo" : sermon.format === "audio" ? "Audio" : "Message écrit";

  return (
    <article>
      {sermon.videoUrl ? (
        <video controls autoPlay={false} preload="metadata" poster={sermon.thumbnailUrl ?? undefined} className="aspect-video w-full rounded-2xl bg-charcoal shadow-md" aria-label={`Vidéo : ${sermon.title}`}>
          <source src={sermon.videoUrl} />
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>
      ) : sermon.audioUrl ? (
        <div className="rounded-2xl bg-gradient-to-br from-royal-900 to-royal p-6 text-white shadow-md sm:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">♫</span>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-royal-100">Prédication audio</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">{sermon.title}</h2>
            <audio controls preload="metadata" className="mt-7 w-full" aria-label={`Audio : ${sermon.title}`}>
              <source src={sermon.audioUrl} />
              Votre navigateur ne prend pas en charge la lecture audio.
            </audio>
          </div>
        </div>
      ) : (
        <section className="rounded-2xl border border-royal-100 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-crimson">Message écrit</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-royal">{sermon.title}</h2>
          {sermon.description && <p className="mt-4 border-l-2 border-gold pl-4 text-base italic leading-7 text-slate">{sermon.description}</p>}
          <div className="mt-7 whitespace-pre-line text-base leading-8 text-charcoal">
            {sermon.content || "Le texte intégral de ce message n’est pas encore disponible."}
          </div>
        </section>
      )}

      <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-royal-100 bg-royal-100 shadow-sm sm:grid-cols-3">
        {[
          { label: "Prédicateur", value: sermon.preacher || "Non renseigné" },
          { label: "Chapelle", value: sermon.chapelName || "CLG" },
          { label: "Format", value: format },
        ].map((item) => <div key={item.label} className="bg-paper-light px-5 py-4"><dt className="text-[11px] uppercase tracking-[0.15em] text-slate-light">{item.label}</dt><dd className="mt-1 font-display font-semibold text-royal">{item.value}</dd></div>)}
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {sermon.videoUrl && <a href={sermon.videoUrl} download className="rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white hover:bg-royal-700">Télécharger la vidéo ↓</a>}
        {!sermon.videoUrl && sermon.audioUrl && <a href={sermon.audioUrl} download className="rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white hover:bg-royal-700">Télécharger l’audio ↓</a>}
        <Link href="/predications" className="rounded-xl border border-royal-100 bg-white px-5 py-3 text-sm font-semibold text-royal-700 hover:bg-royal-50">← Toutes les prédications</Link>
      </div>
    </article>
  );
}
