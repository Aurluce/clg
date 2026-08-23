"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Field, inputClassName } from "@/components/ui/Field";

export function LoginForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Authentification à connecter à l'API Django (JWT).");
      }}
      className="relative overflow-hidden rounded-xl border border-royal-100 bg-paper-light p-8 shadow-md md:p-10"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-royal via-royal-500 to-gold"
      />

      {/* Logo */}
      <div className="flex flex-col items-center text-center">
        <Image
          src="/images/logo/clg-logo.jpeg"
          alt="Church of the Living God"
          width={64}
          height={64}
          className="h-16 w-16 rounded-full object-cover ring-4 ring-paper shadow-md"
        />

        <h2 className="mt-5 font-display text-xl font-semibold text-royal">
          Espace membre CLG
        </h2>

        <p className="mt-1.5 font-body text-sm text-slate">
          Connectez-vous avec votre adresse e-mail.
        </p>
      </div>

      <div className="mt-8">
        <Field label="E-mail" required>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.com"
            className={inputClassName}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Mot de passe" required>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClassName}
          />
        </Field>
      </div>

      <Button type="submit" variant="primary" className="mt-8 w-full">
        Se connecter
        <span aria-hidden="true">→</span>
      </Button>


        <div className="mt-4 text-center">
            <p className="font-body text-sm text-slate">
                Pas encore de compte ?{" "}
                <a
                    href="/inscription"
                    className="font-semibold text-royal transition-colors hover:text-gold"
                >
                    Inscrivez-vous ici
                </a>
            </p>
        </div>

   

      <p className="mt-2 font-mono text-xs leading-relaxed text-slate-light">
        Mot de passe oublié ?{" "}
        <a
          href="/mot-de-passe-oublie"
          className="font-semibold text-royal transition-colors hover:text-gold"
        >
          Réinitialisez-le ici
        </a>
      </p>

      <p className="mt-6 text-center font-mono text-xs leading-relaxed text-slate-light">
        Authentification à connecter à l'API Django (JWT).
      </p>
    </form>
  );
}