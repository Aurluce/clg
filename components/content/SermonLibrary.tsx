"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Sermon } from "@/types/content";

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date non renseignée" : date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function SermonLibrary() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<"all" | Sermon["format"]>("all");
  const [chapel, setChapel] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    let active = true;

    api.content.sermons().then(
      (data) => {
        if (active) setSermons(data);
      },
      (requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Impossible de charger les prédications.");
      },
    ).finally(() => {
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const chapelOptions = useMemo(
    () => Array.from(new Set(sermons.map((sermon) => sermon.chapelName).filter((name): name is string => Boolean(name)))).sort((a, b) => a.localeCompare(b, "fr")),
    [sermons],
  );

  const filteredSermons = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fr");
    return sermons
      .filter((sermon) => format === "all" || sermon.format === format)
      .filter((sermon) => chapel === "all" || sermon.chapelName === chapel)
      .filter((sermon) => !normalizedQuery || [sermon.title, sermon.description, sermon.content, sermon.preacher, sermon.chapelName].filter(Boolean).join(" ").toLocaleLowerCase("fr").includes(normalizedQuery))
      .sort((a, b) => {
        const difference = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === "newest" ? -difference : difference;
      });
  }, [sermons, query, format, chapel, sortOrder]);

  return (
    <section aria-label="Bibliothèque de prédications">
      <div className="mb-7 rounded-2xl border border-royal-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
          <label className="text-sm font-medium text-charcoal">
            Rechercher
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Titre, message, prédicateur…"
              className="mt-2 w-full rounded-xl border border-royal-100 bg-paper-light px-4 py-3 text-sm placeholder:text-slate-light focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal-100"
            />
          </label>
          <label className="text-sm font-medium text-charcoal">
            Type de contenu
            <select value={format} onChange={(event) => setFormat(event.target.value as typeof format)} className="mt-2 w-full rounded-xl border border-royal-100 bg-paper-light px-4 py-3 text-sm focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal-100">
              <option value="all">Tous les formats</option>
              <option value="video">Vidéos</option>
              <option value="audio">Audios</option>
              <option value="texte">Messages écrits</option>
            </select>
          </label>
          <label className="text-sm font-medium text-charcoal">
            Chapelle
            <select value={chapel} onChange={(event) => setChapel(event.target.value)} className="mt-2 w-full rounded-xl border border-royal-100 bg-paper-light px-4 py-3 text-sm focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal-100">
              <option value="all">Toutes les chapelles</option>
              {chapelOptions.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-charcoal">
            Trier par date
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)} className="mt-2 w-full rounded-xl border border-royal-100 bg-paper-light px-4 py-3 text-sm focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal-100">
              <option value="newest">Plus récentes</option>
              <option value="oldest">Plus anciennes</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-royal-50 pt-4">
          <p aria-live="polite" className="text-sm text-slate">{filteredSermons.length} prédication(s) affichée(s) sur {sermons.length}</p>
          {(query || format !== "all" || chapel !== "all" || sortOrder !== "newest") && (
            <button type="button" onClick={() => { setQuery(""); setFormat("all"); setChapel("all"); setSortOrder("newest"); }} className="text-sm font-semibold text-royal-700 hover:underline">
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div role="status" className="rounded-2xl border border-royal-100 bg-white px-5 py-12 text-center text-sm text-slate">Chargement des prédications publiées depuis la base de données…</div>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-crimson-100 bg-red-50 px-5 py-8 text-center text-sm text-crimson-700">{error}</div>
      ) : filteredSermons.length ? (
        <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSermons.map((sermon) => (
            <article key={sermon.id} className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-royal-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              {sermon.videoUrl ? (
                <video controls preload="metadata" poster={sermon.thumbnailUrl ?? undefined} className="aspect-video w-full bg-charcoal" aria-label={`Vidéo : ${sermon.title}`}>
                  <source src={sermon.videoUrl} />
                  Votre navigateur ne prend pas en charge la lecture vidéo.
                </video>
              ) : sermon.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sermon.thumbnailUrl} alt={`Illustration : ${sermon.title}`} className="aspect-video w-full bg-paper-dark object-cover" />
              ) : null}

              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${sermon.format === "video" ? "bg-crimson-100 text-crimson-700" : sermon.format === "audio" ? "bg-royal-50 text-royal-700" : "bg-gold-100 text-gold-700"}`}>
                    {sermon.format === "video" ? "Vidéo" : sermon.format === "audio" ? "Audio" : "Message écrit"}
                  </span>
                  <time className="text-xs text-slate-500" dateTime={sermon.date}>{formatDate(sermon.date)}</time>
                </div>

                <h2 className="mt-4 font-display text-xl font-semibold leading-snug text-royal">{sermon.title}</h2>
                <p className="mt-2 text-sm text-slate">{[sermon.preacher, sermon.chapelName].filter(Boolean).join(" · ") || "Prédication CLG"}</p>

                {sermon.audioUrl && (
                  <audio controls preload="metadata" className="mt-5 w-full" aria-label={`Audio : ${sermon.title}`}>
                    <source src={sermon.audioUrl} />
                    Votre navigateur ne prend pas en charge la lecture audio.
                  </audio>
                )}

                {sermon.format === "texte" && sermon.content && (
                  <div className="mt-4 max-h-40 overflow-hidden whitespace-pre-line text-sm leading-6 text-slate">{sermon.content}</div>
                )}
                {!sermon.videoUrl && !sermon.audioUrl && sermon.format !== "texte" && (
                  <p className="mt-4 rounded-xl bg-paper-light p-3 text-xs leading-5 text-slate">Le fichier média n’est pas disponible pour le moment.</p>
                )}
                {sermon.description && <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate">{sermon.description}</p>}

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                  <Link href={`/predications/${sermon.id}`} className="inline-flex min-h-10 items-center justify-center rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white transition hover:bg-royal-700">
                    {sermon.format === "texte" ? "Lire le message" : "Ouvrir la prédication"}
                  </Link>
                  {sermon.videoUrl && <a href={sermon.videoUrl} download className="text-sm font-medium text-royal-700 hover:underline">Télécharger</a>}
                  {!sermon.videoUrl && sermon.audioUrl && <a href={sermon.audioUrl} download className="text-sm font-medium text-royal-700 hover:underline">Télécharger</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-royal-100 bg-white px-5 py-12 text-center">
          <h2 className="font-display text-xl font-semibold text-royal">Aucune prédication trouvée</h2>
          <p className="mt-2 text-sm text-slate">Modifiez votre recherche ou choisissez un autre filtre.</p>
        </div>
      )}
    </section>
  );
}
