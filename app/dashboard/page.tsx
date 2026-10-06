"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { api } from "@/lib/api";
import type { AuthUser } from "@/types/user";

const destinations = [
  { href: "/", title: "Accueil", description: "Revenir à la page principale." },
  { href: "/chapelles", title: "Les chapelles", description: "Trouver une communauté près de chez vous." },
  { href: "/predications", title: "Les prédications", description: "Écouter et regarder les messages." },
  { href: "/conventions", title: "Les conventions", description: "Découvrir les événements et s’y inscrire." },
  { href: "/temoignages", title: "Les témoignages", description: "Lire les récits de la communauté." },
  { href: "/contact", title: "Nous contacter", description: "Écrire à l’équipe de la CLG." },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const session = api.auth.currentSession();

    if (!session?.access) {
      router.replace("/login");
      return () => {
        active = false;
      };
    }

    api.auth.currentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((reason: unknown) => {
        api.auth.logout();
        if (!active) return;
        setError(reason instanceof Error ? reason.message : "Session expirée. Veuillez vous reconnecter.");
        router.replace("/login");
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (!user) {
    return (
      <Section>
        <Container>
          <p role="status" className="py-16 text-center text-slate">
            {error ?? "Vérification de votre session…"}
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <section className="bg-royal px-5 py-14 text-paper sm:py-20">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Espace membre</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">
            Bonjour {user.fullName}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-royal-100 sm:text-base">
            Votre session est active. Choisissez simplement la page où vous souhaitez aller.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-crimson">Votre espace</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-royal sm:text-3xl">
                Où souhaitez-vous aller ?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                api.auth.logout();
                router.replace("/login");
              }}
              className="rounded-lg border border-royal-100 px-4 py-2 text-sm font-semibold text-royal transition hover:bg-royal-50"
            >
              Se déconnecter
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <Link
                key={destination.href}
                href={destination.href}
                className="group rounded-xl border border-royal-100 bg-paper-light p-6 no-underline shadow-sm transition hover:-translate-y-1 hover:border-royal-300 hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-royal group-hover:text-crimson">
                  {destination.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{destination.description}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-crimson" aria-hidden="true">
                  Ouvrir →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
