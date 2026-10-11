"use client";

import Link from "next/link";
import { ChapelMapSection } from "@/components/content/ChapelMapSection";

export default function MemberChapelsMapPage() {
  return (
    <main className="min-h-screen bg-paper-light px-4 py-8 text-charcoal sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-sm font-semibold text-royal-700 hover:underline">← Retour au tableau de bord</Link>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-crimson">Communauté CLG</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-royal sm:text-4xl">Carte des chapelles</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate sm:text-base">
              Retrouvez toutes les chapelles géolocalisées, partagez votre position GPS et suivez un itinéraire piéton actualisé en direct.
            </p>
          </div>
          <Link href="/chapelles" className="rounded-xl border border-royal-100 bg-white px-4 py-2.5 text-sm font-semibold text-royal-700 shadow-sm hover:bg-royal-50">
            Voir la liste des chapelles
          </Link>
        </header>

        <ChapelMapSection />

        <p className="mt-4 text-xs leading-5 text-slate-500">
          La localisation fonctionne sur HTTPS (ou localhost) après autorisation du navigateur. Les trajets piétons sont calculés avec OpenStreetMap et l’itinéraire est recalculé pendant vos déplacements.
        </p>
      </div>
    </main>
  );
}
