"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, Search, Settings, Sun, UserRound } from "lucide-react";
import { api } from "@/lib/api";
import type { AuthUser } from "@/types/user";

const titles: Record<string, string> = {
  "/dashboard/pastor_admin": "Vue d’ensemble",
  membres: "Gestion des membres",
  activites: "Activités de la chapelle",
  predications: "Prédications",
  temoignages: "Témoignages",
  evenements: "Événements",
  dons: "Dons & offrandes",
  rapports: "Rapports et analyses",
  parametres: "Paramètres",
};

export default function Topbar() {
  const path = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const segment = path.split("/").filter(Boolean).at(-1) || "";
  const title = titles[path] || titles[segment] || "Espace pastoral";
  const fullName = user?.fullName || user?.email || "Pasteur Alain";
  const initials = fullName.trim().split(/\s+/).slice(0, 2).map((name) => name[0]?.toLocaleUpperCase() ?? "").join("") || "PA";

  useEffect(() => {
    const syncUser = () => setUser(api.auth.currentSession()?.user ?? null);
    syncUser();
    return api.auth.onSessionChange(syncUser);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const signOut = () => {
    api.auth.logout();
    router.replace("/login");
  };

  return <>
    <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 pl-[76px] backdrop-blur-xl sm:px-8 sm:pl-[76px] lg:px-9 lg:pl-9">
      <div><div className="flex items-center gap-2 text-xs text-slate-400"><span>CLG Connect</span><span>/</span><span className="font-semibold text-blue-700">Espace pastoral</span></div><h1 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">{title}</h1></div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button type="button" aria-label="Recherche" onClick={() => setNotice("Utilisez le champ de recherche de la page pour filtrer les résultats.")} className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-blue-200 hover:text-blue-700 md:block"><Search size={18} /></button>
        <button type="button" aria-label="Thème clair" onClick={() => setNotice("Le tableau de bord utilise actuellement le thème clair.")} className="hidden rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:text-blue-700 sm:block"><Sun size={18} /></button>
        <button type="button" aria-label="Notifications" onClick={() => setNotice("Vous êtes à jour. Les notifications seront affichées ici.")} className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:text-blue-700"><Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" /></button>
        <div ref={menuRef} className="relative ml-1">
          <button type="button" aria-haspopup="menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-extrabold text-white">{initials}</span>
            <span className="hidden text-left md:block"><span className="block max-w-36 truncate text-xs font-bold text-slate-800">{fullName}</span><span className="block text-[11px] text-slate-400">{user?.systemRole === "SUPER_ADMIN" ? "Super administrateur" : "Administrateur"}</span></span>
            <ChevronDown size={15} className={`hidden text-slate-400 transition md:block ${menuOpen ? "rotate-180" : ""}`} />
          </button>
          {menuOpen && <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
            <div className="border-b border-slate-100 px-3 py-3"><p className="truncate text-sm font-bold text-slate-900">{fullName}</p><p className="mt-1 truncate text-xs text-slate-500">{user?.email ?? "Espace pastoral"}</p></div>
            <Link role="menuitem" href="/dashboard/profil" onClick={() => setMenuOpen(false)} className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><UserRound size={16} />Mon profil</Link>
            <Link role="menuitem" href="/dashboard/pastor_admin/parametres" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><Settings size={16} />Paramètres</Link>
            <Link role="menuitem" href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">↗ Retour au site CLG</Link>
            <button role="menuitem" type="button" onClick={signOut} className="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-slate-100 px-3 py-3 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50"><LogOut size={16} />Se déconnecter</button>
          </div>}
        </div>
      </div>
    </header>
    {notice && <div role="status" className="fixed right-5 top-[90px] z-[70] flex max-w-sm items-start gap-3 rounded-xl border border-blue-100 bg-white p-4 text-sm text-slate-700 shadow-lg"><span className="flex-1">{notice}</span><button type="button" aria-label="Fermer" onClick={() => setNotice("")} className="text-slate-400 hover:text-slate-700">×</button></div>}
  </>;
}
