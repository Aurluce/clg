"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, inputClassName } from "@/components/ui/Field";
import { api } from "@/lib/api";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      await api.contact.send({
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        subject: String(formData.get("subject")),
        message: String(formData.get("message")),
      });
      setFeedback({ kind: "success", message: "Votre message a bien été envoyé." });
      form.reset();
    } catch (error) {
      setFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "L’envoi du message a échoué.",
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
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nom complet" required>
          <input type="text" name="name" required autoComplete="name" placeholder="Votre nom" className={inputClassName} />
        </Field>

        <Field label="E-mail" required>
          <input type="email" name="email" required autoComplete="email" placeholder="vous@exemple.com" className={inputClassName} />
        </Field>
      </div>

      <Field label="Sujet" className="mt-6">
        <select name="subject" defaultValue="" className={inputClassName}>
          <option value="" disabled>
            Choisir un sujet…
          </option>
          <option value="question">Question sur l'Église</option>
          <option value="chapelle">Trouver une chapelle</option>
          <option value="implantation">Implanter une chapelle</option>
          <option value="priere">Demande de prière</option>
          <option value="autre">Autre</option>
        </select>
      </Field>

      <Field label="Message" required className="mt-6">
        <textarea
          name="message"
          rows={6}
          required
          placeholder="Écrivez votre message ici…"
          className={`${inputClassName} resize-y`}
        />
      </Field>

      <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-8 w-full sm:w-auto">
        {isSubmitting ? "Envoi…" : "Envoyer le message"}
        <span aria-hidden="true">→</span>
      </Button>

      {feedback && (
        <p role="status" aria-live="polite" className={`mt-4 text-sm ${feedback.kind === "error" ? "text-crimson" : "text-green-700"}`}>
          {feedback.message}
        </p>
      )}

      <p className="mt-4 font-mono text-xs leading-relaxed text-slate-light">
        Vos données ne seront utilisées que pour répondre à votre message.
      </p>
    </form>
  );
}