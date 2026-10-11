"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Testimony, TestimonyComment } from "@/types/content";

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export function TestimonyDetail({ id }: { id: string }) {
  const [testimony, setTestimony] = useState<Testimony | null>(null);
  const [comments, setComments] = useState<TestimonyComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentFeedback, setCommentFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.testimonies.get(id), api.testimonies.comments(id)]).then(
      ([data, approvedComments]) => {
        if (!active) return;
        setTestimony(data);
        setComments(approvedComments);
      },
      (requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Impossible de charger ce témoignage.");
      },
    ).finally(() => {
      if (active) setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [id]);

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setCommentFeedback(null);
    try {
      const response = await api.testimonies.addComment(id, comment);
      setComment("");
      setCommentFeedback({ kind: "success", message: response.message ?? "Commentaire envoyé pour modération." });
    } catch (requestError) {
      setCommentFeedback({
        kind: "error",
        message: requestError instanceof Error ? requestError.message : "Connectez-vous pour envoyer un commentaire.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div role="status" className="mx-auto max-w-4xl px-6 py-20 text-center text-slate">Chargement du témoignage…</div>;
  }

  if (!testimony) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-royal">Témoignage indisponible</h1>
        <p role="alert" className="mt-3 text-sm text-slate">{error ?? "Ce témoignage n'existe pas ou n'est pas encore publié."}</p>
        <Link href="/temoignages" className="mt-6 inline-flex rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white">Tous les témoignages</Link>
      </main>
    );
  }

  const author = testimony.authorName || "Anonyme";
  const formatLabel = testimony.format === "texte" ? "Message écrit" : testimony.format === "audio" ? "Témoignage audio" : "Témoignage vidéo";

  return (
    <main className="min-h-screen bg-paper-light">
      <header className="border-b border-royal-100 bg-white">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/temoignages" className="text-sm font-semibold text-royal-700 hover:underline">← Tous les témoignages</Link>
          <Link href="/temoignages/nouveau" className="text-sm font-semibold text-crimson hover:underline">Partager le mien</Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-9 sm:px-6 sm:py-14">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-gold-100 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-gold-700">{formatLabel}</span>
          <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-royal sm:text-5xl">{testimony.title || `Témoignage de ${author}`}</h1>
          <p className="mt-4 text-sm text-slate">{author}{testimony.chapelName ? ` · ${testimony.chapelName}` : ""}{testimony.date ? ` · ${formatDate(testimony.date)}` : ""}</p>
        </div>

        <section className="mt-9 rounded-3xl border border-royal-100 bg-white p-5 shadow-sm sm:p-9">
          {testimony.format === "texte" ? (
            <blockquote className="mx-auto max-w-3xl">
              <p className="whitespace-pre-line font-display text-lg leading-8 text-charcoal sm:text-xl">{testimony.content}</p>
            </blockquote>
          ) : testimony.format === "audio" && testimony.audioUrl ? (
            <div>
              <p className="mb-4 font-semibold text-royal">Écouter le témoignage</p>
              <audio controls preload="metadata" className="w-full" aria-label={formatLabel}>
                <source src={testimony.audioUrl} />
                Votre navigateur ne prend pas en charge la lecture audio.
              </audio>
              {testimony.content && <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate">{testimony.content}</p>}
            </div>
          ) : testimony.format === "video" && testimony.videoUrl ? (
            <div>
              <video controls preload="metadata" playsInline className="mx-auto max-h-[70vh] w-full rounded-2xl bg-black" aria-label={formatLabel}>
                <source src={testimony.videoUrl} />
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
              {testimony.content && <p className="mt-6 whitespace-pre-line text-sm leading-7 text-slate">{testimony.content}</p>}
            </div>
          ) : (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Le fichier multimédia est temporairement indisponible.</p>
          )}
          <div className="mt-8 flex items-center gap-3 border-t border-royal-100 pt-5">
            <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-royal font-display text-lg font-bold text-white">{author.charAt(0).toLocaleUpperCase()}</span>
            <div><p className="font-semibold text-royal">{author}</p>{testimony.chapelName && <p className="text-xs text-slate">{testimony.chapelName}</p>}</div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-royal-100 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-end justify-between gap-3 border-b border-royal-100 pb-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-crimson">Communauté</p><h2 className="mt-1 font-display text-2xl font-semibold text-royal">Commentaires</h2></div>
            <span className="text-sm text-slate">{comments.length}</span>
          </div>
          {comments.length ? (
            <ul className="divide-y divide-royal-50">
              {comments.map((item) => <li key={item.id} className="py-4"><p className="whitespace-pre-line text-sm leading-6 text-charcoal">{item.content}</p><p className="mt-2 text-xs text-slate">{item.authorName || "Membre CLG"}{item.date ? ` · ${formatDate(item.date)}` : ""}</p></li>)}
            </ul>
          ) : <p className="py-5 text-sm text-slate">Pas encore de commentaire approuvé. Connectez-vous pour laisser un mot d’encouragement.</p>}

          <form onSubmit={submitComment} className="mt-5 border-t border-royal-100 pt-5">
            <label htmlFor="testimony-comment" className="block text-sm font-semibold text-royal">Laisser un commentaire</label>
            <textarea id="testimony-comment" value={comment} onChange={(event) => setComment(event.target.value)} required maxLength={1000} rows={3} placeholder="Écrivez un encouragement…" className="mt-2 w-full resize-y rounded-xl border border-royal-100 px-4 py-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-royal-100" />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate">Les commentaires sont publiés après modération.</p>
              <button type="submit" disabled={isSubmitting || !comment.trim()} className="rounded-xl bg-royal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-royal-700 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? "Envoi…" : "Envoyer"}</button>
            </div>
            {commentFeedback && <p role="status" className={`mt-3 text-sm ${commentFeedback.kind === "error" ? "text-crimson-700" : "text-emerald-700"}`}>{commentFeedback.message}{commentFeedback.kind === "error" && <>{" "}<Link href="/login" className="font-semibold underline">Se connecter</Link></>}</p>}
          </form>
        </section>
      </article>
    </main>
  );
}
