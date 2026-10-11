"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, ArrowRight, ArrowUpRight, BellRing, CalendarDays, ChevronRight, Clock3, Download, HandHeart, LoaderCircle, Plus, Users, Video, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { api, type PastorDashboardOverview } from "@/lib/api";

const money = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const monthName = (date: Date) => new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);

function formatCountdown(dateValue: string) {
  const target = new Date(`${dateValue}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
  if (days <= 0) return "Aujourd’hui";
  if (days === 1) return "Demain";
  return `Dans ${days} jours`;
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  return new Intl.DateTimeFormat("fr-FR", options).format(new Date(value));
}

export default function DashboardHome() {
  const [overview, setOverview] = useState<PastorDashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.pastor.dashboard().then((data) => {
      if (active) {
        setOverview(data);
        setError("");
      }
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : "Impossible de charger le tableau de bord.");
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const exportReport = () => {
    if (!overview) return;
    const rows = [
      ["Mois", "Nouveaux membres", "Dons XAF"],
      ...overview.monthly.map((point) => [point.month, String(point.members), point.donations]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "rapport-pastoral-clg.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div role="status" className="flex min-h-72 items-center justify-center gap-3 text-sm font-medium text-slate-500"><LoaderCircle className="animate-spin" size={20} />Chargement des données CLG…</div>;
  }

  if (!overview) {
    return <section className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"><h2 className="text-xl font-extrabold text-slate-900">Tableau de bord indisponible</h2><p role="alert" className="mt-2 text-sm text-rose-700">{error || "Impossible de charger les données de votre chapelle."}</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white">Réessayer</button></section>;
  }

  const { stats, monthly, nextSunday, upcomingActivities, pastor, chapel } = overview;
  const donationTotal = Number(overview.stats.donationsThisMonth);
  const nextSundayDate = new Date(`${nextSunday.date}T00:00:00`);
  const monthLabel = monthName(new Date());
  const cards: { label: string; value: string; detail: string; icon: LucideIcon; tone: string }[] = [
    { label: "Membres actifs", value: String(stats.activeMembers), detail: `${stats.newMembersThisMonth} nouvel(le)(s) ce mois-ci`, icon: Users, tone: "blue" },
    { label: "Dons confirmés ce mois", value: `${money.format(donationTotal)} XAF`, detail: `${stats.donationCountThisMonth} contribution(s) confirmée(s)`, icon: HandHeart, tone: "emerald" },
    { label: "Témoignages à modérer", value: String(stats.pendingTestimonies), detail: "En attente de votre décision", icon: BellRing, tone: "amber" },
    { label: "Activités à venir", value: String(stats.upcomingActivities), detail: `Prévues dans ${chapel?.name ?? "la communauté CLG"}`, icon: Activity, tone: "violet" },
  ];
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };
  const activity = nextSunday.activity;

  return <div className="space-y-7 pb-8">
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }} className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 p-6 text-white shadow-xl shadow-blue-200/60 sm:p-8">
      <div aria-hidden="true" className="absolute -right-8 -top-20 h-64 w-64 rounded-full border-[38px] border-white/5" />
      <div aria-hidden="true" className="absolute -right-10 bottom-[-95px] h-64 w-64 rounded-full border-[35px] border-white/5" />
      <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-blue-100"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />{chapel?.name ?? "Espace pastoral CLG"}</div>
          <h2 className="!text-white font-black tracking-tight sm:text-[34px]">Que la paix soit avec vous, {pastor.fullName} 👋</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-blue-100">Voici les données actuelles de {chapel?.name ?? "votre espace pastoral"}, directement issues de la base CLG.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/dashboard/pastor_admin/membres" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-blue-800 shadow-lg transition hover:-translate-y-0.5"><Plus size={16} /> Ajouter un membre</Link><Link href="/dashboard/pastor_admin/activites" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/20"><CalendarDays size={16} /> Planifier une activité</Link></div>
        </div>
        <div className="relative min-w-[220px] rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm lg:min-w-[250px]">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-100"><CalendarDays size={15} /> DIMANCHE PROCHAIN</div>
          <p className="mt-3 text-4xl font-black">{nextSundayDate.getDate()}<span className="ml-1 text-lg font-semibold text-blue-100">{new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(nextSundayDate).replace(".", "").toLocaleUpperCase("fr-FR")}</span></p>
          {activity ? <><p className="mt-1 text-sm font-bold">{activity.title}</p><p className="mt-1 text-xs text-blue-100">{formatDate(activity.date, { hour: "2-digit", minute: "2-digit" })}{activity.location ? ` · ${activity.location}` : ""}</p></> : <p className="mt-2 text-sm leading-5 text-blue-100">Aucune activité n’est enregistrée pour ce dimanche.</p>}
          <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-3 text-xs text-blue-100"><Clock3 size={14} />{formatCountdown(nextSunday.date)}</div>
        </div>
      </div>
    </motion.section>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card, index) => { const Icon = card.icon; return <motion.article key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .07 * index, duration: .35 }} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40 transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/50"><div className="flex items-start justify-between"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[card.tone]}`}><Icon size={20} /></div>{card.label === "Membres actifs" && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700"><ArrowUpRight size={12} />{stats.memberGrowthPercent}%</span>}</div><p className="mt-5 text-xs font-semibold text-slate-500">{card.label}</p><p className="mt-1.5 text-[26px] font-black tracking-tight text-slate-900">{card.value}</p><p className="mt-1 text-[11px] text-slate-400">{card.detail}</p></motion.article>; })}</div>

    <div className="grid gap-6 xl:grid-cols-2">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Nouveaux membres</h3><p className="mt-1 text-xs text-slate-400">Comptes créés par mois · six derniers mois</p></div><button type="button" onClick={exportReport} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><Download size={14} /> Exporter</button></div>
        <div className="mt-5 h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthly} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}><defs><linearGradient id="memberFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={.22} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dy={10} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} /><Area type="monotone" dataKey="members" name="Nouveaux membres" stroke="#2563eb" strokeWidth={3} fill="url(#memberFill)" activeDot={{ r: 5, strokeWidth: 0 }} /></AreaChart></ResponsiveContainer></div>
      </motion.section>
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div><h3 className="font-extrabold text-slate-900">Dons confirmés</h3><p className="mt-1 text-xs text-slate-400">Contributions enregistrées par mois · XAF</p></div>
        <div className="mt-5 h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthly} margin={{ top: 10, right: 5, left: -14, bottom: 0 }}><CartesianGrid stroke="#eef2f7" strokeDasharray="4 4" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} dy={10} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} /><Tooltip formatter={(value) => `${money.format(Number(value))} XAF`} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} /><Bar dataKey="donations" name="Dons confirmés" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={34} /></BarChart></ResponsiveContainer></div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-indigo-50/70 p-4"><div><p className="text-[11px] font-semibold text-indigo-700">Total collecté en {monthLabel}</p><p className="mt-1 text-xl font-black text-slate-900">{money.format(donationTotal)} XAF</p></div><span className="rounded-full bg-white px-2.5 py-1.5 text-[10px] font-extrabold text-indigo-700">{stats.donationCountThisMonth} don(s)</span></div>
      </motion.section>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between gap-3"><div><h3 className="font-extrabold text-slate-900">Activités à venir</h3><p className="mt-1 text-xs text-slate-400">Prochains rendez-vous de {chapel?.name ?? "la chapelle"}</p></div><Link href="/dashboard/pastor_admin/activites" className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">Tout voir <ChevronRight size={14} /></Link></div>
        {upcomingActivities.length ? <div className="mt-5 space-y-3">{upcomingActivities.map((item) => <article key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-100 hover:bg-blue-50/30"><div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CalendarDays size={17} /><span className="mt-0.5 text-[8px] font-extrabold">{formatDate(item.date, { day: "2-digit", month: "short" }).toLocaleUpperCase("fr-FR")}</span></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-extrabold text-slate-800">{item.title}</p><p className="mt-1 text-[10px] text-slate-400">{formatDate(item.date, { weekday: "short", hour: "2-digit", minute: "2-digit" })}{item.location ? ` · ${item.location}` : ""}</p></div><span className="hidden rounded-full bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-700 sm:inline-flex">{formatCountdown(item.date.slice(0, 10))}</span></article>)}</div> : <p className="mt-5 rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">Aucune activité à venir dans la base de données.</p>}
        <Link href="/dashboard/pastor_admin/activites" className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Voir le calendrier complet <ArrowRight size={14} /></Link>
      </section>
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"><div><h3 className="font-extrabold text-slate-900">Raccourcis pastoraux</h3><p className="mt-1 text-xs text-slate-400">Accès à la gestion de la chapelle</p></div><div className="mt-5 space-y-3"><Link href="/dashboard/pastor_admin/predications" className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-violet-200 hover:bg-violet-50/40"><span className="rounded-xl bg-violet-50 p-3 text-violet-700"><Video size={19} /></span><span className="flex-1"><span className="block text-sm font-extrabold text-slate-800">Prédications</span><span className="mt-1 block text-xs text-slate-400">{stats.publishedSermons} publiée(s) dans la base</span></span><ArrowRight size={15} className="text-slate-300 group-hover:text-violet-700" /></Link><Link href="/dashboard/pastor_admin/temoignages" className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-amber-200 hover:bg-amber-50/40"><span className="rounded-xl bg-amber-50 p-3 text-amber-700"><BellRing size={19} /></span><span className="flex-1"><span className="block text-sm font-extrabold text-slate-800">Témoignages à modérer</span><span className="mt-1 block text-xs text-slate-400">{stats.pendingTestimonies} en attente</span></span><span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-extrabold text-amber-800">{stats.pendingTestimonies}</span></Link><Link href="/dashboard/pastor_admin/rapports" className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"><span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Zap size={19} /></span><span className="flex-1"><span className="block text-sm font-extrabold text-slate-800">Bilan de la chapelle</span><span className="mt-1 block text-xs text-slate-400">{stats.activeMembers} membre(s) actif(s)</span></span><ArrowRight size={15} className="text-slate-300 group-hover:text-emerald-700" /></Link></div></section>
    </div>
    {error && <p role="status" className="text-center text-xs text-amber-700">Actualisation interrompue : {error}</p>}
    <p className="text-center text-[10px] text-slate-400">Les statistiques et activités sont chargées depuis la base de données CLG.</p>
  </div>;
}
