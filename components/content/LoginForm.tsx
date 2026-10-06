"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, inputClassName } from "@/components/ui/Field";
import { api } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const [sessionName, setSessionName] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    try {
      const session = await api.auth.login({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      setSessionName(session.user?.fullName ?? session.user?.email ?? "Membre CLG");
      setFeedback({ kind: "success", message: "Connexion réussie. Votre session est active dans cet onglet." });
      router.push("/dashboard");
    } catch (error) {
      setFeedback({
        kind: "error",
        message: error instanceof Error ? error.message : "La connexion a échoué.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
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

      <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-8 w-full">
        {isSubmitting ? "Connexion…" : "Se connecter"}
        <span aria-hidden="true">→</span>
      </Button>

      {feedback && (
        <p role="status" aria-live="polite" className={`mt-4 text-sm ${feedback.kind === "error" ? "text-crimson" : "text-green-700"}`}>
          {feedback.message}
        </p>
      )}


        <div className="mt-4 text-center">
            <p className="font-body text-sm text-slate">
                Pas encore de compte ?{" "}
                <Link
                    href="/inscription"
                    className="font-semibold text-royal transition-colors hover:text-gold"
                >
                    Inscrivez-vous ici
                </Link>
            </p>
        </div>

   

      <p className="mt-2 font-mono text-xs leading-relaxed text-slate-light">
        Mot de passe oublié ?{" "}
        <Link
          href="/mot-de-passe-oublie"
          className="font-semibold text-royal transition-colors hover:text-gold"
        >
          Réinitialisez-le ici
        </Link>
      </p>

      {sessionName && (
        <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-sm font-medium text-green-800">Session active : {sessionName}</p>
          <button
            type="button"
            onClick={() => {
              api.auth.logout();
              setSessionName(null);
              setFeedback(null);
            }}
            className="mt-2 text-sm font-semibold text-royal underline underline-offset-2"
          >
            Se déconnecter
          </button>
        </div>
      )}

    </form>
  );
}