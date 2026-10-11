"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_DASHBOARD_URL, ApiError, api, type MemberDashboardData } from "@/lib/api";
import type { SoulStatus, SystemRole } from "@/types/user";

const menu = [
  { label: "Mon tableau de bord", href: "/dashboard", icon: "▦" },
  { label: "Mon compte", href: "/dashboard/profil", icon: "⚙" },
  { label: "Ma chapelle", href: "/dashboard/chapelles", icon: "⌂" },
  { label: "Prédications", href: "/dashboard/predications", icon: "▷" },
  { label: "Témoignages", href: "/dashboard/temoignages", icon: "♡" },
  { label: "Conventions", href: "/dashboard/conventions", icon: "◇" },
  { label: "Faire un don", href: "/dons", icon: "♥" },
];

const roleDashboardLinks: Record<SystemRole, { label: string; href: string; external?: boolean }> = {
  MEMBER: { label: "Espace membre", href: "/dashboard" },
  PASTOR_ADMIN: { label: "Espace administrateur pasteur", href: "/dashboard/pastor_admin" },
  DEVELOPER: { label: "Console développeur", href: "/dashboard/developer" },
  SUPER_ADMIN: { label: "Console super administrateur", href: "/dashboard/super_admin"},
};

const roleLabels: Record<SystemRole, string> = {
  MEMBER: "Membre",
  PASTOR_ADMIN: "Administrateur pasteur",
  DEVELOPER: "Développeur",
  SUPER_ADMIN: "Super administrateur",
};

const soulStatusLabels: Record<SoulStatus, string> = {
  SIMPLE_FIDELE: "Simple fidèle",
  ASPIRANT: "Aspirant",
  DIACRE: "Diacre",
  ENUQUE: "Énuque",
  PASTEUR: "Pasteur",
};

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toLocaleUpperCase() ?? "")
      .join("") || "CLG"
  );
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboard, setDashboard] = useState<MemberDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadMember = async () => {
      const session = api.auth.currentSession();
      if (!session?.access) {
        if (active) {
          setIsLoading(false);
          router.replace("/login");
        }
        return;
      }

      try {
        const currentDashboard = await api.auth.dashboard();
        if (active) {
          setDashboard(currentDashboard);
          setLoadError(null);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          api.auth.logout();
          if (active) router.replace("/login");
        } else if (active) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Impossible de charger vos informations pour le moment.",
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadMember();
    const unsubscribe = api.auth.onSessionChange(() => void loadMember());

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  // Bloque le défilement de la page et gère Échap quand le menu mobile est ouvert
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const signOut = () => {
    api.auth.logout();
    router.replace("/");
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-600">
        <p role="status" aria-live="polite">
          Chargement de votre espace membre…
        </p>
      </main>
    );
  }

  if (!dashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Connexion requise</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {loadError ?? "Connectez-vous pour accéder à votre espace membre CLG."}
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900"
          >
            Se connecter
          </Link>
        </section>
      </main>
    );
  }

  const member = dashboard.member;
  const memberName = member.fullName || member.email;
  const initials = getInitials(memberName);
  const status = member.soulStatus
    ? soulStatusLabels[member.soulStatus] ?? "Membre CLG"
    : "Membre CLG";
  const roleDashboard = roleDashboardLinks[member.systemRole];
  const chapel = member.chapelName || "Aucune chapelle associée";
  const contentItems = [
    ...dashboard.sermons.map((sermon) => ({
      category: "PRÉDICATION",
      title: sermon.title,
      description: [sermon.preacher, sermon.chapelName].filter(Boolean).join(" · ") || "Nouvel enseignement publié",
      date: sermon.date,
      href: "/predications",
      icon: "▷",
      color: "bg-blue-50 text-blue-700",
    })),
    ...dashboard.conventions.map((convention) => ({
      category: "CONVENTION",
      title: convention.title,
      description: [convention.location, new Date(convention.startDate).toLocaleDateString("fr-FR")].filter(Boolean).join(" · "),
      date: convention.startDate,
      href: `/conventions/${convention.slug}`,
      icon: "◇",
      color: "bg-amber-50 text-amber-700",
    })),
    ...dashboard.events.map((event) => ({
      category: "ÉVÉNEMENT",
      title: event.title,
      description: [event.location, new Date(event.date).toLocaleDateString("fr-FR")].filter(Boolean).join(" · "),
      date: event.date,
      href: "/evangelisation",
      icon: "⌂",
      color: "bg-emerald-50 text-emerald-700",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  return (
    <div className="flex items-stretch bg-slate-50 text-slate-800">
      {/* Fond sombre mobile : au-dessus du contenu (z-40), sous le menu (z-50) */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* ===== MENU LATÉRAL (fixe, colonne indépendante) ===== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-slate-200 bg-white transition-transform duration-200 lg:relative lg:inset-auto lg:z-20 lg:max-w-none lg:shrink-0 lg:translate-x-0 ${
          menuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col lg:sticky lg:top-[var(--site-header-h,0px)] lg:h-[calc(100dvh_-_var(--site-header-h,0px))]">
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-slate-100 px-6">
         
          <div className="min-w-0">
            <p className="font-bold text-blue-950">CLG</p>
            <p className="text-xs text-slate-500">Espace membre</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer"
            className="ml-auto rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            ✕
          </button>
        </div>

        <div className="shrink-0 border-b border-slate-100 p-5">
          <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-200 bg-cover bg-center font-bold text-blue-900"
              style={member.profilePhoto ? { backgroundImage: `url("${member.profilePhoto}")` } : undefined}
            >
              {!member.profilePhoto && initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-blue-950">{memberName}</p>
              <p className="mt-1 truncate text-xs text-blue-700">{status}</p>
            </div>
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
            MON ESPACE
          </p>
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                pathname === item.href
                  ? "bg-blue-800 font-semibold text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-blue-800"
              }`}
            >
              <span className="w-5 shrink-0 text-center text-lg">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 hover:bg-slate-100"
          >
            <span aria-hidden="true">↗</span>
            Retour au site CLG
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-blue-800"
          >
            <span aria-hidden="true">↪</span>
            Se déconnecter
          </button>
          <p className="px-3 pb-1 pt-3 text-xs text-slate-400">Church of the Living God</p>
        </div>
        </div>
      </aside>

      {/* ===== ZONE PRINCIPALE (décalée à droite du menu sur grand écran) ===== */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-[var(--site-header-h,0px)] z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:h-20 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 lg:hidden"
            >
              ☰
            </button>
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Espace personnel</p>
              <h1 className="truncate font-bold text-slate-900 sm:text-lg">Mon tableau de bord</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden max-w-48 truncate text-sm font-medium text-slate-700 sm:block">
              {memberName}
            </span>
            <span
              aria-label={`Compte de ${memberName}`}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100 bg-cover bg-center text-sm font-bold text-blue-900 ring-2 ring-white"
              style={member.profilePhoto ? { backgroundImage: `url("${member.profilePhoto}")` } : undefined}
            >
              {!member.profilePhoto && initials}
            </span>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-4 sm:p-6 lg:gap-10 lg:p-8">
          {loadError && (
            <p
              role="status"
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              Vos informations enregistrées sont affichées, mais leur actualisation a échoué : {loadError}
            </p>
          )}

          <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Accès selon votre rôle</p>
              <p className="mt-1 text-sm text-slate-600">Votre rôle : <span className="font-semibold text-slate-900">{roleLabels[member.systemRole]}</span></p>
            </div>
            {roleDashboard.external ? (
              <a
                href={roleDashboard.href}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
              >
                Ouvrir {roleDashboard.label}<span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link
                href={roleDashboard.href}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
              >
                Ouvrir {roleDashboard.label}<span aria-hidden="true">→</span>
              </Link>
            )}
          </section>

          {/* ----- 1. Bandeau de bienvenue ----- */}
          <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 p-6 text-white shadow-lg sm:p-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border-[35px] border-white/5 sm:h-96 sm:w-96"
            />
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-50">
                Mon espace personnel
              </span>
              <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl">
                Bienvenue, {memberName.split(" ")[0]}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">
                {dashboard.stats.publishedSermons} prédications publiées, {dashboard.stats.upcomingConventions} conventions à venir et les informations réelles de votre compte.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/predications"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-950 hover:bg-blue-50"
                >
                  Explorer les prédications
                </Link>
                <Link
                  href="/temoignages/nouveau"
                  className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Partager un témoignage
                </Link>
              </div>
            </div>
          </section>

          {/* ----- 2. Résumé (3 cartes de même hauteur) ----- */}
          <section aria-label="Résumé de mon espace" className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="flex min-h-48 min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-800">
                  ♙
                </span>
                <p className="text-sm text-slate-500">Mes témoignages</p>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{dashboard.stats.testimonies}</p>
              <p className="mt-auto pt-4 text-sm text-slate-500">{dashboard.stats.pendingTestimonies} en attente de validation</p>
            </article>

            <article className="flex min-h-48 min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-800">
                  ⌂
                </span>
                <p className="text-sm text-slate-500">Mes conventions</p>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{dashboard.stats.conventionRegistrations}</p>
              <p className="mt-auto pt-4 text-sm text-slate-500">inscriptions enregistrées</p>
            </article>

            {/* <article className="flex min-h-48 min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-xl text-rose-700">
                  ♡
                </span>
                <p className="text-sm text-slate-500">Mes dons confirmés</p>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{dashboard.stats.successfulDonationTotal} XAF</p>
              <p className="mt-auto pt-4 text-sm text-slate-500">{dashboard.stats.successfulDonations} dons réussis</p>
            </article> */}

            <article className="flex min-h-48 min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-800">⌂</span>
                <p className="text-sm text-slate-500">Ma chapelle</p>
              </div>
              <p className="mt-4 text-xl font-bold text-slate-900">{chapel}</p>
              <p className="mt-auto pt-4 text-sm text-slate-500">{member.city}{member.city && member.country ? ", " : ""}{member.country}</p>
            </article>
          </section>

          {/* ----- 3. La vie de la CLG ----- */}
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                Restez connecté
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">La vie de la CLG</h2>
              <p className="mt-1 text-sm text-slate-500">
                Explorez les contenus et les activités de l&apos;Église.
              </p>
            </div>

            <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
              {contentItems.length ? contentItems.map((activity) => (
                <article
                  key={activity.title}
                  className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${activity.color}`}
                  >
                    {activity.icon}
                  </div>
                  <p className="mt-5 text-[10px] font-bold tracking-[0.16em] text-slate-400">
                    {activity.category}
                  </p>
                  <h3 className="mt-2 font-bold text-slate-900">{activity.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{activity.description}</p>
                  <p className="mt-3 text-xs text-slate-400">{new Date(activity.date).toLocaleDateString("fr-FR")}</p>
                  <Link
                    href={activity.href}
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Découvrir <span aria-hidden="true">→</span>
                  </Link>
                </article>
              )) : (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-sm text-slate-500 md:col-span-2 xl:col-span-3">
                  Aucun contenu publié ou événement à venir pour le moment.
                </p>
              )}
            </div>
          </section>

          {/* ----- 4. Activités + Compte ----- */}
          <section className="grid items-stretch gap-6 xl:grid-cols-2">
            <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">Mes dernières activités</h2>
                  <p className="mt-1 text-sm text-slate-500">Votre historique personnel</p>
                </div>
                <span className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-lg">◷</span>
              </div>
              {dashboard.recentActivity.length ? (
                <ul className="mt-5 divide-y divide-slate-100">
                  {dashboard.recentActivity.map((activity, index) => (
                    <li key={`${activity.kind}-${activity.date}-${index}`} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800" aria-hidden="true">
                        {activity.kind === "testimony" ? "♡" : activity.kind === "convention" ? "◇" : "♥"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <Link href={activity.href} className="block truncate text-sm font-semibold text-slate-800 hover:text-blue-800">{activity.title}</Link>
                        <p className="mt-1 text-xs text-slate-500">{activity.description}</p>
                      </div>
                      <time className="shrink-0 text-xs text-slate-400" dateTime={activity.date}>{new Date(activity.date).toLocaleDateString("fr-FR")}</time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                  Vos inscriptions, témoignages et dons apparaîtront ici.
                </p>
              )}
            </article>

            <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900">Mon compte</h2>
                  <p className="mt-1 text-sm text-slate-500">Vos informations de connexion</p>
                </div>
                <span className="shrink-0 rounded-xl bg-blue-50 px-3 py-2 text-lg text-blue-800">
                  ⚙
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="border-b border-slate-100 pb-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Nom complet
                  </p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-800">{memberName}</p>
                </div>
                <div className="border-b border-slate-100 pb-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Chapelle</p>
                  <p className="mt-1 break-words text-sm font-medium text-slate-800">{chapel}</p>
                </div>
                <div className="border-b border-slate-100 pb-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Adresse e-mail
                  </p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">{member.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Statut du compte
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{status}</p>
                </div>
              </div>
            </article>
          </section>

          <footer className="mt-auto border-t border-slate-200 py-5 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Church of the Living God · Espace membre
          </footer>
        </main>
      </div>
    </div>
  );
}