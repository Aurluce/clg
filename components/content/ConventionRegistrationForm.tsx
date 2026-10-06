"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, inputClassName } from "@/components/ui/Field";
import { api } from "@/lib/api";

export function ConventionRegistrationForm({ conventionSlug }: { conventionSlug: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      await api.conventions.register(conventionSlug, {
        name: String(formData.get("name")),
        chapel: String(formData.get("chapel")),
        phone: String(formData.get("phone")),
        attendees: Number(formData.get("attendees")),
      });
      setFeedback({ kind: "success", message: "Votre inscription a bien été enregistrée." });
      form.reset();
    } catch (error) {
      setFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "L’inscription a échoué.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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

      <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-8 w-full sm:w-auto">
        {isSubmitting ? "Envoi…" : "Confirmer mon inscription"}
        <span aria-hidden="true">→</span>
      </Button>

      {feedback && (
        <p role="status" aria-live="polite" className={`mt-4 text-sm ${feedback.kind === "error" ? "text-crimson" : "text-green-700"}`}>
          {feedback.message}
        </p>
      )}

      <p className="mt-4 font-mono text-xs leading-relaxed text-slate-light">
        Vous recevrez une confirmation par SMS une fois votre inscription validée.
      </p>
    </form>
  );
}