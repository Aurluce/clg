"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TestimonyCard } from "@/components/content/Cards";
import { api } from "@/lib/api";
import type { Chapel, Testimony } from "@/types/content";

type Filters = { format: string; chapel: string; q: string };

export function TestimonyGallery() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [chapels, setChapels] = useState<Chapel[]>([]);
  const [filters, setFilters] = useState<Filters>({ format: "", chapel: "", q: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef(0);

  useEffect(() => {
    let active = true;
    api.content.chapels().then((data) => {
      if (active) setChapels(data);
    }).catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const requestId = ++latestRequest.current;
    api.testimonies.list(filters).then(
      (data) => {
        if (requestId !== latestRequest.current) return;
        setTestimonies(data);
        setError(null);
      },
      (requestError: unknown) => {
        if (requestId !== latestRequest.current) return;
        setError(requestError instanceof Error ? requestError.message : "Impossible de charger les témoignages.");
      },
    ).finally(() => {
      if (requestId === latestRequest.current) setIsLoading(false);
    });

    return () => {
      latestRequest.current += 1;
    };
  }, [filters]);

  return (
    <div>
      <form
        className="grid gap-4 rounded-2xl border border-royal-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_190px_220px_auto] lg:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setIsLoading(true);
          setFilters({
            format: String(form.get("format") ?? ""),
            chapel: String(form.get("chapel") ?? ""),
            q: String(form.get("q") ?? "").trim(),
          });
        }}
      >
        <label className="block text-sm font-medium text-charcoal">
          Rechercher
          <input key={filters.q} name="q" type="search" defaultValue={filters.q} placeholder="Un nom, une histoire…" className="mt-2 w-full rounded-xl border border-royal-100 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-royal focus:ring-4 focus:ring-royal-100" />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Format
          <select key={filters.format} name="format" defaultValue={filters.format} className="mt-2 w-full rounded-xl border border-royal-100 bg-white px-3 py-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-royal-100">
            <option value="">Tous les formats</option>
            <option value="texte">Texte</option>
            <option value="audio">Audio</option>
            <option value="video">Vidéo</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Chapelle
          <select key={filters.chapel} name="chapel" defaultValue={filters.chapel} className="mt-2 w-full rounded-xl border border-royal-100 bg-white px-3 py-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-royal-100">
            <option value="">Toutes les chapelles</option>
            {chapels.map((chapel) => <option key={chapel.slug} value={chapel.slug}>{chapel.name}</option>)}
          </select>
        </label>
        <button type="submit" className="min-h-11 rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white transition hover:bg-royal-700">Filtrer</button>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate">{isLoading ? "Recherche…" : `${testimonies.length} témoignage(s) publié(s)`}</p>
        <Link href="/temoignages/nouveau" className="inline-flex items-center gap-2 rounded-xl bg-crimson px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-crimson-700">
          Partager mon témoignage <span aria-hidden="true">→</span>
        </Link>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl border border-crimson-100 bg-red-50 px-4 py-3 text-sm text-crimson-700">{error}</p>}

      {isLoading && testimonies.length === 0 ? (
        <div role="status" className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-56 animate-pulse rounded-2xl bg-royal-50" />)}
        </div>
      ) : testimonies.length ? (
        <div className="mt-6 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {testimonies.map((testimony) => <TestimonyCard key={testimony.id} testimony={testimony} />)}
        </div>
      ) : !error ? (
        <div className="mt-6 rounded-2xl border border-dashed border-royal-100 bg-white px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold text-royal">Aucun témoignage trouvé</p>
          <p className="mt-2 text-sm text-slate">Essayez un autre filtre ou soyez le premier à partager votre histoire.</p>
          <button type="button" onClick={() => {
            setIsLoading(true);
            setFilters({ format: "", chapel: "", q: "" });
          }} className="mt-5 text-sm font-semibold text-royal-700 hover:underline">Effacer les filtres</button>
        </div>
      ) : null}
    </div>
  );
}
