"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Field, inputClassName } from "@/components/ui/Field";
import { cn } from "@/lib/utils/cn";

const formats = [
  {
    value: "texte",
    label: "Texte",
    hint: "Écrivez votre témoignage",
    icon: (
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    ),
  },
  {
    value: "audio",
    label: "Audio",
    hint: "Enregistrez votre voix",
    icon: (
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    ),
  },
  {
    value: "video",
    label: "Vidéo",
    hint: "Filmez votre témoignage",
    icon: <path d="m22 8-6 4 6 4V8ZM14 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2Z" />,
  },
] as const;

export default function NewTestimonyPage() {
  const [format, setFormat] = useState<(typeof formats)[number]["value"]>("texte");

  return (
    <>
      <PageHero
        eyebrow="Témoignages"
        title="Partager mon témoignage"
        subtitle="Votre histoire peut encourager des milliers de personnes. Elle sera publiée après validation par votre chapelle."
      />

      <Section>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Formulaire à connecter à l'API (POST /api/testimonies).");
          }}
          className="mx-auto max-w-2xl rounded-xl border border-royal-100 bg-paper-light p-7 shadow-sm md:p-10"
        >
          {/* Choix du format */}
          <fieldset>
            <legend className="font-body text-sm font-medium text-charcoal">
              Format de mon témoignage<span className="ml-0.5 text-crimson">*</span>
            </legend>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {formats.map((f) => {
                const active = format === f.value;

                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFormat(f.value)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all duration-200",
                      active
                        ? "border-crimson bg-crimson text-paper shadow-sm"
                        : "border-royal-100 bg-paper text-slate hover:border-royal hover:text-royal"
                    )}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      {f.icon}
                    </svg>

                    <span className="font-body text-sm font-semibold">{f.label}</span>
                    <span className={cn("font-mono text-[11px]", active ? "text-paper/80" : "text-slate-light")}>
                      {f.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8">
            <Field label="Nom complet" required>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Votre nom"
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="mt-6">
            <Field label="Ma chapelle" hint="Facultatif — la chapelle CLG dont vous êtes membre.">
              <input
                type="text"
                name="chapel"
                placeholder="Ex. : CLG Douala Centre"
                className={inputClassName}
              />
            </Field>
          </div>

          {format === "texte" ? (
            <div className="mt-6">
              <Field label="Mon témoignage" required hint="Minimum quelques lignes — soyez authentique et précis.">
                <textarea
                  name="content"
                  required
                  rows={7}
                  placeholder="Racontez ce que Dieu a fait dans votre vie…"
                  className={`${inputClassName} resize-y`}
                />
              </Field>
            </div>
          ) : (
            <div className="mt-6">
              <Field
                label={`Fichier ${format === "audio" ? "audio" : "vidéo"}`}
                required
                hint={`Formats acceptés : ${format === "audio" ? "MP3, M4A, WAV" : "MP4, MOV"} — 50 Mo maximum.`}
              >
                <label
                  htmlFor="testimony-file"
                  className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-royal-100 bg-paper px-6 py-10 text-center transition-colors hover:border-royal hover:bg-royal-50/40"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 text-royal"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>

                  <span className="font-body text-sm font-medium text-royal">
                    Cliquez pour choisir un fichier
                  </span>

                  <span className="font-mono text-xs text-slate-light">
                    ou glissez-déposez-le ici
                  </span>

                  <input
                    id="testimony-file"
                    type="file"
                    name="file"
                    accept={format === "audio" ? "audio/*" : "video/*"}
                    required
                    className="sr-only"
                  />
                </label>
              </Field>
            </div>
          )}

          <Button type="submit" variant="primary" className="mt-8 w-full sm:w-auto">
            Envoyer mon témoignage
            <span aria-hidden="true">→</span>
          </Button>

          <p className="mt-4 font-mono text-xs leading-relaxed text-slate-light">
            Votre témoignage sera relu par le pasteur de votre chapelle avant publication.
          </p>
        </form>
      </Section>
    </>
  );
}