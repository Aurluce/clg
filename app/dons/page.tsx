"use client";

import { useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Field, inputClassName } from "@/components/ui/Field";
import { cn } from "@/lib/utils/cn";

const amounts = [5000, 10000, 25000, 50000];

const impacts = [
  {
    title: "Évangélisation",
    text: "Financer les croisades et les campagnes d'évangélisation dans les villes.",
  },
  {
    title: "Conventions",
    text: "Organiser les conventions nationales : logistique, sonorisation, accueil.",
  },
  {
    title: "Vie des chapelles",
    text: "Soutenir les chapelles naissantes et leurs activités locales.",
  },
];

export default function DonationsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10000);
  const [customAmount, setCustomAmount] = useState("");

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;

  return (
    <>
      <PageHero
        eyebrow="Dons"
        title="Soutenir l'œuvre de la CLG"
        subtitle="Chaque don contribue à l'évangélisation, aux conventions et à la vie des chapelles à travers le monde."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Colonne impact */}
          <div>
            <SectionHeading
              eyebrow="Pourquoi donner ?"
              title="Votre don porte du fruit"
              lead="La CLG vit entièrement de la générosité de ses membres. Voici concrètement ce que votre soutien rend possible."
            />

            <ul className="mt-8 space-y-5">
              {impacts.map((impact, i) => (
                <li key={impact.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-royal-50 font-display text-sm font-bold text-royal"
                  >
                    {i + 1}
                  </span>

                  <div>
                    <p className="font-display text-base font-semibold text-royal">
                      {impact.title}
                    </p>
                    <p className="mt-1 font-body text-sm leading-relaxed text-slate">
                      {impact.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 rounded-lg border border-gold-100 bg-gold-100/40 px-5 py-4 font-body text-sm leading-relaxed text-charcoal">
              «&nbsp;Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni
              contrainte ; car Dieu aime celui qui donne avec joie.&nbsp;»
              <span className="mt-1 block font-mono text-xs uppercase tracking-[0.15em] text-gold-700">
                2 Corinthiens 9.7
              </span>
            </p>
          </div>

          {/* Carte de don */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  `Don de ${effectiveAmount?.toLocaleString("fr-FR") ?? 0} FCFA — paiement à brancher (Mobile Money, carte bancaire...).`
                );
              }}
              className="relative overflow-hidden rounded-xl border border-royal-100 bg-paper-light p-7 shadow-md md:p-9"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-crimson via-crimson-300 to-gold"
              />

              <h2 className="font-display text-2xl font-semibold text-royal">
                Faire un don
              </h2>

              <p className="mt-2 font-body text-sm text-slate">
                Montant en francs CFA (FCFA)
              </p>

              {/* Montants prédéfinis */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {amounts.map((amount) => {
                  const active = !customAmount && selectedAmount === amount;

                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      aria-pressed={active}
                      className={cn(
                        "rounded-lg border px-4 py-3.5 font-body text-sm font-medium transition-all duration-200",
                        active
                          ? "border-crimson bg-crimson text-paper shadow-sm"
                          : "border-royal-100 bg-paper text-royal hover:border-crimson hover:text-crimson"
                      )}
                    >
                      {amount.toLocaleString("fr-FR")}
                    </button>
                  );
                })}
              </div>

              {/* Montant libre */}
              <Field label="Ou choisir un autre montant" className="mt-6">
                <input
                  type="number"
                  min={500}
                  step={500}
                  inputMode="numeric"
                  placeholder="Montant libre (FCFA)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className={inputClassName}
                />
              </Field>

              {/* Récapitulatif */}
              <div className="mt-6 flex items-center justify-between rounded-lg bg-paper-dark px-5 py-4">
                <span className="font-body text-sm font-medium text-charcoal">
                  Montant sélectionné
                </span>

                <span className="font-display text-xl font-bold text-royal">
                  {effectiveAmount && effectiveAmount > 0
                    ? `${effectiveAmount.toLocaleString("fr-FR")} FCFA`
                    : "—"}
                </span>
              </div>

              <Button type="submit" variant="primary" className="mt-6 w-full">
                Faire un don
                <span aria-hidden="true">→</span>
              </Button>

              <p className="mt-4 font-mono text-xs leading-relaxed text-slate-light">
                Le moyen de paiement (Mobile Money, carte bancaire...) sera branché une fois le
                prestataire choisi avec l'Église.
              </p>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}