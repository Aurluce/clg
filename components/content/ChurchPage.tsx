"use client";

import { useEffect, useState } from "react";
import { CTABand } from "@/components/ui/CTABand";
import { ObjectiveCard } from "@/components/ui/ObjectiveCard";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorldThread } from "@/components/ui/WorldThread";
import { api } from "@/lib/api";
import type { ChurchPageContent } from "@/types/content";

export function ChurchPage() {
  const [content, setContent] = useState<ChurchPageContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    api.content.churchPage().then(
      (data) => {
        if (active) {
          setContent(data);
          setError(null);
        }
      },
      (requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Impossible de charger le contenu de la page.");
        }
      },
    );

    return () => {
      active = false;
    };
  }, [attempt]);

  if (error) {
    return (
      <Section className="min-h-[50vh] py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-crimson-100 bg-paper-light p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-royal">Contenu momentanément indisponible</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-slate">{error}</p>
          <button onClick={() => setAttempt((value) => value + 1)} className="mt-6 rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white hover:bg-royal-700">
            Réessayer
          </button>
        </div>
      </Section>
    );
  }

  if (!content) {
    return (
      <main className="min-h-[70vh] animate-pulse">
        <div className="h-72 bg-royal-50 sm:h-96" />
        <div className="mx-auto max-w-4xl space-y-4 px-6 py-16">
          <div className="mx-auto h-5 w-32 rounded bg-royal-50" />
          <div className="mx-auto h-8 max-w-xl rounded bg-royal-50" />
          <div className="mx-auto h-4 max-w-2xl rounded bg-royal-50" />
        </div>
      </main>
    );
  }

  const chapters = [
    { index: "01", title: "Genèse", text: content.genesis },
    { index: "02", title: "Vision", text: content.vision },
  ];
  const objectives = [
    { label: "Court terme", text: content.shortTermObjective, accent: "crimson" as const },
    { label: "Moyen terme", text: content.mediumTermObjective, accent: "royal" as const },
    { label: "Long terme", text: content.longTermObjective, accent: "gold" as const },
  ];

  return (
    <>
      <PageHero eyebrow={content.scriptureReference} title={content.heroTitle} subtitle={content.heroSubtitle} />

      <Section className="pb-0">
        <figure className="relative mx-auto max-w-3xl text-center">
          <span aria-hidden="true" className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 select-none font-display text-[8rem] leading-none text-gold-100">“</span>
          <blockquote className="relative">
            <p className="whitespace-pre-line font-display text-2xl font-medium italic leading-relaxed text-royal md:text-3xl">{content.scriptureQuote}</p>
          </blockquote>
          <figcaption className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-gold-700">{content.scriptureReference}</figcaption>
        </figure>
      </Section>

      <WorldThread className="mt-16 text-gold md:mt-20" />

      <Section>
        <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
          {chapters.map((chapter) => (
            <article key={chapter.index} className="relative border-t-2 border-royal-100 pt-8">
              <span aria-hidden="true" className="absolute -top-5 left-0 select-none bg-paper pr-4 font-display text-5xl font-bold text-gold">{chapter.index}</span>
              <h2 className="relative mt-4 font-display text-2xl font-semibold text-royal md:text-3xl">{chapter.title}</h2>
              <p className="mt-4 whitespace-pre-line font-body text-base leading-relaxed text-slate">{chapter.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-t border-royal-100 bg-paper-light">
        <SectionHeading eyebrow="Objectifs" title="Où nous allons" lead={content.objectivesIntro} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {objectives.map((objective) => (
            <ObjectiveCard key={objective.label} label={objective.label} text={objective.text} accent={objective.accent} />
          ))}
        </div>
      </Section>

      <CTABand
        eyebrow={content.ctaEyebrow}
        title={content.ctaTitle}
        text={content.ctaText}
        primaryLabel="Voir les chapelles"
        primaryHref="/chapelles"
        secondaryLabel="Nous contacter"
        secondaryHref="/contact"
      />
    </>
  );
}
