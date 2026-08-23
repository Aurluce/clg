import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type {
  Chapel,
  Sermon,
  Testimony,
  Convention,
  Book,
  EvangelizationCampaign,
} from "@/types/content";

/* =========================================================
   ICÔNES (SVG inline)
   ========================================================= */

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-3.5 w-3.5", className)} aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4", className)} aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-3 w-3", className)} aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

function IconHeadphones({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-3 w-3", className)} aria-hidden="true">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-3.5 w-3.5", className)} aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconQuote({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("h-6 w-6", className)} aria-hidden="true">
      <path d="M10 8c-3 .5-4.5 2.3-4.5 5H8v6H2v-6c0-4.4 2.7-7.2 8-8v3Zm11 0c-3 .5-4.5 2.3-4.5 5H19v6h-6v-6c0-4.4 2.7-7.2 8-8v3Z" />
    </svg>
  );
}

function IconBookOpen({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4", className)} aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3Z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3Z" />
    </svg>
  );
}

function IconMegaphone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4", className)} aria-hidden="true">
      <path d="m3 11 18-5v12L3 14v-3Z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

function IconMusic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4", className)} aria-hidden="true">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

/* =========================================================
   BASE COMMUNE
   ========================================================= */

const cardBase =
  "group relative flex h-full flex-col overflow-hidden rounded-xl border border-royal-100 bg-paper p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-royal-300 hover:shadow-lg hover:shadow-royal-100/60";

const cardLinkBase = `${cardBase} no-underline`;

const arrowClasses =
  "text-slate-light transition-all duration-300 group-hover:translate-x-1 group-hover:text-crimson";

/* =========================================================
   CHAPELLE
   ========================================================= */

export function ChapelCard({ chapel }: { chapel: Chapel }) {
  return (
    <Link href={`/chapelles/${chapel.slug}`} className={cardLinkBase}>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-royal via-royal-500 to-gold opacity-90"
      />

      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-royal-50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-royal-700">
        <IconMapPin />
        {chapel.country}
      </span>

      <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-royal transition-colors group-hover:text-royal-700">
        {chapel.name}
      </h3>

      <p className="mt-1 font-body text-sm text-slate">{chapel.city}</p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-royal-100/80 pt-4">
        <p className="font-body text-xs leading-snug text-charcoal">
          Dirigée par{" "}
          <span className="font-medium">{chapel.pastorName}</span>
        </p>
        <span className={arrowClasses} aria-hidden="true">
          <IconArrowRight />
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   PRÉDICATION
   ========================================================= */

export function SermonCard({ sermon }: { sermon: Sermon }) {
  const isVideo = sermon.format === "video";

  return (
    <Link href={`/predications/${sermon.id}`} className={cardLinkBase}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]",
            isVideo ? "bg-crimson-100 text-crimson-700" : "bg-royal-50 text-royal-700"
          )}
        >
          {isVideo ? <IconPlay /> : <IconHeadphones />}
          {isVideo ? "Vidéo" : "Audio"}
        </span>

        <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-slate-light">
          {sermon.chapelName}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-royal transition-colors group-hover:text-royal-700">
        {sermon.title}
      </h3>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-royal-100/80 pt-4">
        <p className="truncate font-body text-xs text-charcoal">
          <span className="font-medium">{sermon.preacher}</span>
          {" · "}
          {new Date(sermon.date).toLocaleDateString("fr-FR")}
        </p>
        <span className={arrowClasses} aria-hidden="true">
          <IconArrowRight />
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   TÉMOIGNAGE
   ========================================================= */

export function TestimonyCard({ testimony }: { testimony: Testimony }) {
  return (
    <Link href={`/temoignages/${testimony.id}`} className={cardLinkBase}>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-gold-300 to-gold opacity-90"
      />

      <div className="flex items-center justify-between gap-3">
        <IconQuote className="text-gold" />

        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
          {testimony.format === "video" ? <IconPlay /> : testimony.format === "audio" ? <IconHeadphones /> : null}
          {testimony.format}
        </span>
      </div>

      <p className="mt-4 font-body text-sm italic leading-relaxed text-charcoal">
        «&nbsp;{testimony.excerpt}&nbsp;»
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-royal-100/80 pt-4">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-royal">
            {testimony.authorName}
          </p>
          {testimony.chapelName && (
            <p className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-slate-light">
              {testimony.chapelName}
            </p>
          )}
        </div>
        <span className={arrowClasses} aria-hidden="true">
          <IconArrowRight />
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   CONVENTION
   ========================================================= */

export function ConventionCard({ convention }: { convention: Convention }) {
  const upcoming = convention.status === "nouvelle";

  return (
    <Link href={`/conventions/${convention.slug}`} className={cardLinkBase}>
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-1 opacity-90",
          upcoming
            ? "bg-gradient-to-r from-crimson via-crimson-300 to-gold"
            : "bg-gradient-to-r from-royal via-royal-300 to-royal-100"
        )}
      />

      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]",
            upcoming ? "bg-crimson-100 text-crimson-700" : "bg-paper-dark text-slate"
          )}
        >
          {upcoming ? "À venir" : "Archive"}
        </span>

        <span className="font-display text-2xl font-semibold text-royal-100 transition-colors group-hover:text-royal-300">
          {convention.year}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-royal transition-colors group-hover:text-royal-700">
        {convention.title}
      </h3>

      <p className="mt-1 inline-flex items-center gap-1.5 font-body text-sm text-slate">
        <IconMapPin />
        {convention.location}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-royal-100/80 pt-4">
        <p className="inline-flex items-center gap-1.5 font-body text-xs text-charcoal">
          <IconCalendar className="text-gold-700" />
          {new Date(convention.startDate).toLocaleDateString("fr-FR")} —{" "}
          {new Date(convention.endDate).toLocaleDateString("fr-FR")}
        </p>
        <span className={arrowClasses} aria-hidden="true">
          <IconArrowRight />
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   OUVRAGE
   ========================================================= */

export function BookCard({ book }: { book: Book }) {
  return (
    <article className={cardBase}>
      {/* Dos de livre décoratif */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-royal via-royal-500 to-royal-900"
      />

      <div className="pl-3">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
            <IconBookOpen />
            Ouvrage
          </span>
        </div>

        <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-royal">
          {book.title}
        </h3>

        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-light">
          Apôtre T. Beaudelaire
        </p>

        <p className="mt-3 font-body text-sm leading-relaxed text-charcoal">
          {book.description}
        </p>
      </div>
    </article>
  );
}

/* =========================================================
   CAMPAGNE D'ÉVANGÉLISATION
   ========================================================= */

export function CampaignCard({ campaign }: { campaign: EvangelizationCampaign }) {
  const date = new Date(campaign.date);

  return (
    <article className={cardBase}>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-crimson-300 to-gold opacity-90"
      />

      <div className="flex items-start gap-5">
        {/* Badge date */}
        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-royal text-paper shadow-sm">
          <span className="font-display text-2xl font-bold leading-none">
            {date.getDate()}
          </span>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-royal-100">
            {date.toLocaleDateString("fr-FR", { month: "short" })}
          </span>
        </div>

        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-crimson">
            <IconMegaphone />
            Croisade
          </p>

          <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug text-royal">
            {campaign.title}
          </h3>

          <p className="mt-1 inline-flex items-center gap-1.5 font-body text-sm text-slate">
            <IconMapPin />
            {campaign.location}
          </p>
        </div>
      </div>

      <p className="mt-4 border-t border-royal-100/80 pt-4 font-body text-sm leading-relaxed text-charcoal">
        {campaign.description}
      </p>
    </article>
  );
}

/* =========================================================
   CHANT DE CHORALE
   ========================================================= */

export function ChoirSongCard({
  song,
}: {
  song: { id: string; title: string; chapelName: string; format: string; lyricsExcerpt?: string };
}) {
  const isVideo = song.format === "video";

  return (
    <article className={cardBase}>
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-700">
          <IconMusic />
        </span>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em]",
            isVideo ? "bg-crimson-100 text-crimson-700" : "bg-royal-50 text-royal-700"
          )}
        >
          {isVideo ? <IconPlay /> : <IconHeadphones />}
          {isVideo ? "Vidéo" : "Texte"}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-royal">
        {song.title}
      </h3>

      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-slate-light">
        {song.chapelName}
      </p>

      {!isVideo && song.lyricsExcerpt && (
        <p className="mt-3 border-t border-royal-100/80 pt-4 font-body text-sm italic leading-relaxed text-charcoal">
          «&nbsp;{song.lyricsExcerpt}&nbsp;»
        </p>
      )}
    </article>
  );
}