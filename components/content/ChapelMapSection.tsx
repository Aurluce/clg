"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Chapel, ChapelDetail } from "@/types/content";
import type { ChapelLocation } from "@/components/content/ChapelsMap";

const ChapelsMap = dynamic(() => import("@/components/content/ChapelsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[430px] items-center justify-center rounded-2xl bg-royal-50 text-sm text-slate sm:h-[560px]">
      Chargement de la carte interactive…
    </div>
  ),
});

export function ChapelMapSection({
  initialSelectedSlug = null,
  showChapelSelector = true,
}: {
  initialSelectedSlug?: string | null;
  showChapelSelector?: boolean;
}) {
  const [chapels, setChapels] = useState<ChapelLocation[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSelectedSlug);
  const [selectedDetail, setSelectedDetail] = useState<ChapelDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(Boolean(initialSelectedSlug));
  const [detailError, setDetailError] = useState<string | null>(null);

  function selectChapel(slug: string | null) {
    setSelectedSlug(slug);
    setSelectedDetail(null);
    setDetailError(null);
    setIsLoadingDetail(Boolean(slug));
  }
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api.content.chapels().then(
      (data: Chapel[]) => {
        if (!active) return;
        setChapels(data.map((chapel, index) => ({
          id: chapel.id ?? chapel.slug ?? String(index),
          slug: chapel.slug,
          name: chapel.name,
          address: chapel.address ?? "",
          city: chapel.city,
          country: chapel.country,
          latitude: chapel.latitude == null || chapel.latitude === "" ? Number.NaN : Number(chapel.latitude),
          longitude: chapel.longitude == null || chapel.longitude === "" ? Number.NaN : Number(chapel.longitude),
        })));
      },
      (requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Impossible de charger les chapelles.");
      },
    ).finally(() => {
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;

    let active = true;
    api.content.chapel(selectedSlug).then(
      (detail) => {
        if (active) setSelectedDetail(detail);
      },
      (requestError: unknown) => {
        if (active) setDetailError(requestError instanceof Error ? requestError.message : "Impossible de charger les détails de cette chapelle.");
      },
    ).finally(() => {
      if (active) setIsLoadingDetail(false);
    });

    return () => {
      active = false;
    };
  }, [selectedSlug]);

  return (
    <div>
      {isLoading && <p role="status" className="mb-3 text-sm text-slate">Chargement des chapelles depuis la base de données…</p>}
      {error && <p role="alert" className="mb-3 rounded-xl border border-crimson-100 bg-red-50 px-4 py-3 text-sm text-crimson-700">{error} La carte reste affichée, mais les marqueurs n’ont pas pu être chargés.</p>}
      {showChapelSelector && chapels.length > 0 && (
        <section aria-label="Choisir une chapelle" className="mb-4 rounded-2xl border border-royal-100 bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold text-royal">Choisissez une chapelle</h3>
              <p className="mt-1 text-sm text-slate">Sélectionnez son nom pour la centrer sur la carte et consulter sa fiche.</p>
            </div>
            <span className="text-xs text-slate">{chapels.length} au total</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {chapels.map((chapel) => (
              <button
                key={chapel.id}
                type="button"
                aria-pressed={selectedSlug === chapel.slug}
                onClick={() => selectChapel(chapel.slug)}
                className={`min-w-48 rounded-xl border px-4 py-3 text-left transition ${selectedSlug === chapel.slug ? "border-royal bg-royal-50 ring-2 ring-royal-100" : "border-royal-100 bg-white hover:border-royal-300 hover:bg-royal-50"}`}
              >
                <span className="block truncate text-sm font-semibold text-royal-900">{chapel.name}</span>
                <span className="mt-1 block truncate text-xs text-slate">{[chapel.city, chapel.country].filter(Boolean).join(", ")}</span>
                {!Number.isFinite(chapel.latitude) || !Number.isFinite(chapel.longitude) ? <span className="mt-2 block text-xs text-amber-700">Position GPS non renseignée</span> : null}
              </button>
            ))}
          </div>
        </section>
      )}

      <ChapelsMap
        chapels={chapels}
        selectedSlug={selectedSlug}
        onSelectChapel={selectChapel}
      />

      {selectedSlug && (
        <section aria-live="polite" className="mt-5 rounded-2xl border border-royal-100 bg-white p-5 shadow-sm sm:p-7">
          {isLoadingDetail ? (
            <p role="status" className="py-5 text-center text-sm text-slate">Chargement de toutes les informations de la chapelle…</p>
          ) : detailError ? (
            <p role="alert" className="py-3 text-sm text-crimson-700">{detailError}</p>
          ) : selectedDetail ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-royal-100 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-crimson">Fiche de la chapelle</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-royal">{selectedDetail.name}</h2>
                  <p className="mt-1 text-sm text-slate">{[selectedDetail.city, selectedDetail.region, selectedDetail.country].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-royal-50 px-3 py-1.5 font-semibold text-royal-800">{selectedDetail.memberCount} membres</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-800">{selectedDetail.activities.length} activités</span>
                  <span className="rounded-full bg-gold-100 px-3 py-1.5 font-semibold text-gold-700">{selectedDetail.sermons.length} prédications</span>
                </div>
              </div>

              {selectedDetail.description && <p className="whitespace-pre-line py-5 text-sm leading-7 text-slate">{selectedDetail.description}</p>}

              <dl className="grid gap-4 border-b border-royal-100 py-5 sm:grid-cols-2 lg:grid-cols-4">
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pasteur</dt><dd className="mt-1 text-sm font-medium text-charcoal">{selectedDetail.pastorName || "Non renseigné"}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Adresse</dt><dd className="mt-1 text-sm text-charcoal">{[selectedDetail.address, selectedDetail.city, selectedDetail.country].filter(Boolean).join(", ") || "Non renseignée"}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Téléphone</dt><dd className="mt-1 text-sm text-charcoal">{selectedDetail.phone ? <a className="text-royal-700 hover:underline" href={`tel:${selectedDetail.phone}`}>{selectedDetail.phone}</a> : "Non renseigné"}</dd></div>
                <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">E-mail</dt><dd className="mt-1 break-all text-sm text-charcoal">{selectedDetail.email ? <a className="text-royal-700 hover:underline" href={`mailto:${selectedDetail.email}`}>{selectedDetail.email}</a> : "Non renseigné"}</dd></div>
              </dl>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="font-display text-lg font-semibold text-royal">Activités</h3>
                  {selectedDetail.activities.length ? <ul className="mt-3 space-y-3">{selectedDetail.activities.map((activity) => <li key={activity.id} className="rounded-xl bg-paper-light p-4"><p className="font-semibold text-charcoal">{activity.title}</p><p className="mt-1 text-xs text-slate">{new Date(activity.date).toLocaleString("fr-FR")}{activity.location ? ` · ${activity.location}` : ""}</p>{activity.description && <p className="mt-2 text-sm leading-5 text-slate">{activity.description}</p>}</li>)}</ul> : <p className="mt-3 text-sm text-slate">Aucune activité publiée pour le moment.</p>}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-royal">Prédications</h3>
                  {selectedDetail.sermons.length ? <ul className="mt-3 divide-y divide-royal-100 rounded-xl border border-royal-100 px-4">{selectedDetail.sermons.map((sermon) => <li key={sermon.id} className="py-3"><p className="font-semibold text-charcoal">{sermon.title}</p><p className="mt-1 text-xs text-slate">{sermon.preacher} · {new Date(sermon.date).toLocaleDateString("fr-FR")}</p></li>)}</ul> : <p className="mt-3 text-sm text-slate">Aucune prédication publiée pour le moment.</p>}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-royal">Événements</h3>
                  {selectedDetail.events.length ? <ul className="mt-3 space-y-3">{selectedDetail.events.map((event) => <li key={event.id} className="rounded-xl bg-paper-light p-4"><p className="font-semibold text-charcoal">{event.title}</p><p className="mt-1 text-xs text-slate">{new Date(event.date).toLocaleString("fr-FR")}{event.location ? ` · ${event.location}` : ""}</p>{event.description && <p className="mt-2 text-sm leading-5 text-slate">{event.description}</p>}</li>)}</ul> : <p className="mt-3 text-sm text-slate">Aucun événement publié pour le moment.</p>}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-royal">Témoignages approuvés</h3>
                  {selectedDetail.testimonies.length ? <ul className="mt-3 space-y-3">{selectedDetail.testimonies.map((testimony) => <li key={testimony.id} className="rounded-xl bg-paper-light p-4"><p className="text-sm leading-6 text-slate">{testimony.excerpt}</p><p className="mt-2 text-xs text-slate-500">{testimony.authorName} · {new Date(testimony.date).toLocaleDateString("fr-FR")}</p></li>)}</ul> : <p className="mt-3 text-sm text-slate">Aucun témoignage approuvé pour le moment.</p>}
                </div>
              </div>
            </>
          ) : null}
        </section>
      )}
    </div>
  );
}
