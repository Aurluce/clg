"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Eye, LoaderCircle, MessageSquareQuote, Search, X } from "lucide-react";
import { api, type PastorTestimonyRecord } from "@/lib/api";

const statusLabel: Record<PastorTestimonyRecord["status"], string> = {
  PENDING: "À modérer",
  APPROVED: "Publié",
  REJECTED: "Rejeté",
};

export default function PastorTestimoniesSection() {
  const [testimonies, setTestimonies] = useState<PastorTestimonyRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<PastorTestimonyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      setTestimonies(await api.pastor.testimonies());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Impossible de charger les témoignages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api.pastor.testimonies().then((items) => {
      if (active) setTestimonies(items);
    }).catch((loadError: unknown) => {
      if (active) setError(loadError instanceof Error ? loadError.message : "Impossible de charger les témoignages.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const rows = useMemo(() => testimonies.filter((item) => {
    const matchesSearch = `${item.title} ${item.authorName} ${item.content}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
    return matchesSearch && (filter === "ALL" || item.status === filter);
  }), [filter, search, testimonies]);

  async function moderate(item: PastorTestimonyRecord, status: PastorTestimonyRecord["status"]) {
    setSavingId(item.id);
    setError("");
    setNotice("");
    try {
      await api.pastor.moderateTestimony(item.id, status);
      setNotice(`Le témoignage de ${item.authorName} est maintenant « ${statusLabel[status]} ».`);
      if (selected?.id === item.id) setSelected({ ...item, status });
      await reload();
    } catch (moderationError) {
      setError(moderationError instanceof Error ? moderationError.message : "La modération a échoué.");
    } finally {
      setSavingId(null);
    }
  }

  return <div className="space-y-7 pb-8">
    <div><p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold tracking-[.2em] text-blue-700"><span className="h-px w-6 bg-blue-600" />PAROLES DE FOI</p><h2 className="text-3xl font-black tracking-tight text-slate-900">Témoignages</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Lisez et modérez les témoignages soumis par les membres de votre chapelle.</p></div>
    {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Fermer"><X size={16} /></button></div>}
    {error && <div role="alert" className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}<button type="button" onClick={() => setError("")} aria-label="Fermer"><X size={16} /></button></div>}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div><h3 className="font-extrabold text-slate-900">Modération des témoignages</h3><p className="mt-1 text-xs text-slate-400">{rows.length} témoignage(s) · données de l’API CLG</p></div><div className="flex flex-wrap gap-2"><label className="flex min-w-[190px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 sm:flex-none"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un auteur…" className="w-full bg-transparent text-xs outline-none sm:w-44" /></label><select aria-label="Filtrer par statut" value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600"><option value="ALL">Tous les statuts</option><option value="PENDING">À modérer</option><option value="APPROVED">Publiés</option><option value="REJECTED">Rejetés</option></select><button type="button" onClick={() => void reload()} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Actualiser</button></div></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-slate-50/80"><tr>{["Témoignage", "Auteur", "Reçu le", "Statut", "Actions"].map((label) => <th key={label} className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{!loading && rows.map((item) => <tr key={item.id} className="hover:bg-blue-50/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><MessageSquareQuote size={17} /></span><div><p className="text-sm font-bold text-slate-800">{item.title}</p><p className="mt-1 max-w-[240px] truncate text-xs text-slate-400">{item.content || "Témoignage multimédia"}</p></div></div></td><td className="px-5 py-4 text-xs font-semibold text-slate-600">{item.authorName}</td><td className="px-5 py-4 text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString("fr-FR")}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold ${item.status === "PENDING" ? "bg-amber-50 text-amber-700" : item.status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{statusLabel[item.status]}</span></td><td className="px-5 py-4"><div className="flex items-center gap-1"><button type="button" aria-label={`Voir le témoignage de ${item.authorName}`} onClick={() => setSelected(item)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700"><Eye size={15} /></button><details className="relative"><summary aria-label={`Actions supplémentaires pour ${item.authorName}`} className="flex cursor-pointer list-none items-center rounded-lg p-2 text-slate-400 hover:bg-slate-100"><ChevronDown size={16} /></summary><div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">{item.status !== "APPROVED" && <button type="button" disabled={savingId === item.id} onClick={() => void moderate(item, "APPROVED")} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-emerald-700 hover:bg-emerald-50"><Check size={14} />Approuver et publier</button>}{item.status !== "REJECTED" && <button type="button" disabled={savingId === item.id} onClick={() => void moderate(item, "REJECTED")} className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50">Rejeter</button>}{item.status !== "PENDING" && <button type="button" disabled={savingId === item.id} onClick={() => void moderate(item, "PENDING")} className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-slate-50">Remettre en attente</button>}{savingId === item.id && <span className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400"><LoaderCircle size={14} className="animate-spin" />Mise à jour…</span>}</div></details></div></td></tr>)}</tbody></table>{loading && <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin" />Chargement des témoignages…</div>}{!loading && rows.length === 0 && <p className="p-12 text-center text-sm text-slate-400">Aucun témoignage trouvé.</p>}</div>
    </section>
    {selected && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section role="dialog" aria-modal="true" aria-labelledby="testimony-dialog-title" className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-slate-100 p-5"><div><h3 id="testimony-dialog-title" className="font-extrabold text-slate-900">{selected.title}</h3><p className="mt-1 text-xs text-slate-500">{selected.authorName} · {new Date(selected.createdAt).toLocaleString("fr-FR")}</p></div><button type="button" onClick={() => setSelected(null)} aria-label="Fermer" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={17} /></button></header><p className="max-h-[50dvh] overflow-y-auto whitespace-pre-wrap p-5 text-sm leading-7 text-slate-700">{selected.content || "Ce témoignage ne contient pas de texte."}</p><footer className="flex justify-end gap-2 border-t border-slate-100 p-4"><button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Fermer</button>{selected.status !== "APPROVED" && <button type="button" disabled={savingId === selected.id} onClick={() => void moderate(selected, "APPROVED")} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">Approuver et publier</button>}</footer></section></div>}
  </div>;
}
