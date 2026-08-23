"use client";

import { Button } from "@/components/ui/Button";
import { Field, inputClassName } from "@/components/ui/Field";

export function ConventionRegistrationForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Inscription à connecter à l'API (POST /api/conventions/:slug/register).");
      }}
      className="rounded-xl border border-royal-100 bg-paper-light p-7 shadow-sm md:p-9"
    >
      <h2 className="font-display text-xl font-semibold text-royal">
        Vos informations
      </h2>

      <div className="mt-7">
        <Field label="Nom complet" required>
          <input type="text" name="name" required autoComplete="name" placeholder="Votre nom" className={inputClassName} />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Chapelle" required hint="La chapelle CLG dont vous êtes membre.">
          <input type="text" name="chapel" required placeholder="Ex. : CLG Douala Centre" className={inputClassName} />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Téléphone" required hint="Pour vous envoyer les informations pratiques.">
          <input type="tel" name="phone" required autoComplete="tel" placeholder="+237 6XX XXX XXX" className={inputClassName} />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Nombre de personnes" hint="Incluez les enfants qui vous accompagneront.">
          <select name="attendees" defaultValue="1" className={inputClassName}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} {n > 1 ? "personnes" : "personne"}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Button type="submit" variant="primary" className="mt-8 w-full sm:w-auto">
        Confirmer mon inscription
        <span aria-hidden="true">→</span>
      </Button>

      <p className="mt-4 font-mono text-xs leading-relaxed text-slate-light">
        Vous recevrez une confirmation par SMS une fois votre inscription validée.
      </p>
    </form>
  );
}