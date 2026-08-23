"use client";

import { Button } from "@/components/ui/Button";
import { Field, inputClassName } from "@/components/ui/Field";

export function ContactForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Formulaire à connecter à l'API (POST /api/contact).");
      }}
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

      <Button type="submit" variant="primary" className="mt-8 w-full sm:w-auto">
        Envoyer le message
        <span aria-hidden="true">→</span>
      </Button>

      <p className="mt-4 font-mono text-xs leading-relaxed text-slate-light">
        Vos données ne seront utilisées que pour répondre à votre message.
      </p>
    </form>
  );
}