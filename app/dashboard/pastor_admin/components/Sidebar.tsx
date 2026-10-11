'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BookOpen, CalendarDays, ChartNoAxesCombined, Church, CircleDollarSign, LayoutDashboard, MessageSquareQuote, Settings, Users, X, HeartHandshake, Menu } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/dashboard/pastor_admin', label: 'Vue d’ensemble', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/pastor_admin/membres', label: 'Membres', icon: Users },
  { href: '/dashboard/pastor_admin/activites', label: 'Activités', icon: CalendarDays },
  { href: '/dashboard/pastor_admin/predications', label: 'Prédications', icon: BookOpen },
  { href: '/dashboard/pastor_admin/temoignages', label: 'Témoignages', icon: MessageSquareQuote },
  { href: '/dashboard/pastor_admin/evenements', label: 'Événements', icon: Activity },
  { href: '/dashboard/pastor_admin/dons', label: 'Dons & offrandes', icon: CircleDollarSign },
  { href: '/dashboard/pastor_admin/rapports', label: 'Rapports', icon: ChartNoAxesCombined },
];
export default function Sidebar() {
  const path = usePathname(); const [open, setOpen] = useState(false);
  return <>
    <button aria-label="Ouvrir le menu" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-40 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm lg:hidden"><Menu size={20}/></button>
    {open && <button aria-label="Fermer le menu" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex h-dvh max-h-dvh w-[270px] flex-col overflow-hidden border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-slate-100 px-6">
        <Link href="/dashboard/pastor_admin" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-200"><Church size={23}/></span>
          <span><span className="block text-[17px] font-extrabold tracking-tight text-slate-900">CLG <span className="text-blue-700">Connect</span></span><span className="block text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Espace pastoral</span></span>
        </Link>
        <button onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"><X size={18}/></button>
      </div>
      <div className="shrink-0 px-5 pt-6"><div className="rounded-2xl bg-gradient-to-br from-blue-700 via-blue-700 to-indigo-700 p-4 text-white"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Church size={20}/></div><div className="min-w-0"><p className="truncate text-sm font-bold">Chapelle de la Grâce</p><p className="mt-0.5 text-xs text-blue-100">Yaoundé, Cameroun</p></div></div><div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3"><span className="text-xs text-blue-100">Espace administrateur</span><span className="h-2 w-2 rounded-full bg-emerald-300"/></div></div></div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-4 py-6"><p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-400">Gestion de la chapelle</p>{links.map(({href,label,icon:Icon,exact}) => {const active = exact ? path === href : path.startsWith(href); return <Link key={href} href={href} onClick={() => setOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition-all ${active ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/60' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}><Icon size={18} strokeWidth={active ? 2.4 : 2}/><span className="flex-1">{label}</span>{active && <span className="h-1.5 w-1.5 rounded-full bg-blue-600"/>}</Link>})}</nav>
      <div className="shrink-0 border-t border-slate-100 p-4"><Link href="/dashboard/pastor_admin/parametres" onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-semibold ${path.endsWith('/parametres') ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}><Settings size={18}/> Paramètres</Link><div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-300 text-sm font-extrabold text-orange-900">PA</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">Pasteur Alain</p><p className="truncate text-xs text-slate-500">Administrateur</p></div><HeartHandshake size={17} className="text-slate-400"/></div></div>
    </aside>
  </>;
}
