"use client";

import { useEffect, useState } from "react";
import { ChapelCard } from "@/components/content/Cards";
import { api } from "@/lib/api";
import type { Chapel } from "@/types/content";

export function ChapelDirectory() {
  const [chapels, setChapels] = useState<Chapel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api.content.chapels().then(
      (data) => {
        if (active) setChapels(data);
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

  if (isLoading) {
    return <p role="status" className="mt-8 text-sm text-slate">Chargement des chapelles…</p>;
  }

  if (error) {
    return <p role="alert" className="mt-8 rounded-xl border border-crimson-100 bg-red-50 px-4 py-3 text-sm text-crimson-700">{error}</p>;
  }

  if (!chapels.length) {
    return <p className="mt-8 rounded-xl border border-dashed border-royal-100 bg-white px-5 py-8 text-sm text-slate">Aucune chapelle active n’est publiée pour le moment.</p>;
  }

  return (
    <>
      <p className="mt-8 text-sm text-slate">{chapels.length} chapelle(s) active(s)</p>
      <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {chapels.map((chapel) => <ChapelCard key={chapel.slug} chapel={chapel} />)}
      </div>
    </>
  );
}
