"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Check, ChevronDown, Download, Eye, LoaderCircle, Pencil, Plus, Search, Trash2, UserRound, X } from "lucide-react";
import { api, type PastorActivityRecord, type PastorMemberRecord } from "@/lib/api";
import type { Chapel } from "@/types/content";

type Section = "membres" | "activites";
type MemberDraft = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  churchStatus: string;
  chapelSlug: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
  isApproved: boolean;
  isVerified: boolean;
};
type ActivityDraft = {
  title: string;
  description: string;
  date: string;
  location: string;
  chapelSlug: string;
};

const churchStatuses = [
  ["SIMPLE_FIDELE", "Simple fidèle"], ["ASPIRANT", "Aspirant"], ["DIACRE", "Diacre"],
  ["ENUQUE", "Énuque"], ["PASTEUR", "Pasteur"], ["INSTRUMENTISTE", "Instrumentiste"],
  ["CHORISTE", "Choriste"], ["MONITEUR/TRICE", "Moniteur/trice"], ["EVANGELISTE", "Évangéliste"],
];
const fieldClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";
const labelClass = "block text-xs font-bold text-slate-600";

function localDateValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function dateLabel(value: string) {
  return new Date(value).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue. Réessayez.";
}

export default function PastorRecordsSection({ section }: { section: Section }) {
  const isMembers = section === "membres";
  const [members, setMembers] = useState<PastorMemberRecord[]>([]);
  const [activities, setActivities] = useState<PastorActivityRecord[]>([]);
  const [chapels, setChapels] = useState<Chapel[]>([]);
  const [isSuperAdmin] = useState(() => api.auth.currentSession()?.user?.systemRole === "SUPER_ADMIN");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<PastorMemberRecord | PastorActivityRecord | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | null>(null);
  const [memberDraft, setMemberDraft] = useState<MemberDraft>({
    fullName: "", email: "", phone: "", country: "", city: "", churchStatus: "SIMPLE_FIDELE",
    chapelSlug: "", password: "", confirmPassword: "", isActive: true, isApproved: true, isVerified: false,
  });
  const [activityDraft, setActivityDraft] = useState<ActivityDraft>({ title: "", description: "", date: "", location: "", chapelSlug: "" });

  const reload = async () => {
    setIsLoading(true);
    setError("");
    try {
      const records = isMembers ? await api.pastor.members() : await api.pastor.activities();
      if (isMembers) setMembers(records as PastorMemberRecord[]);
      else setActivities(records as PastorActivityRecord[]);
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadInitialData = async () => {
      try {
        const records = isMembers ? await api.pastor.members() : await api.pastor.activities();
        if (active) {
          if (isMembers) setMembers(records as PastorMemberRecord[]);
          else setActivities(records as PastorActivityRecord[]);
        }
      } catch (loadError) {
        if (active) setError(errorMessage(loadError));
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void loadInitialData();
    void api.content.chapels().then((items) => { if (active) setChapels(items); }).catch(() => { if (active) setChapels([]); });
    return () => { active = false; };
  }, [isMembers]);

  const rows = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (isMembers) {
      return members.filter((member) => {
        const matchesTerm = !term || `${member.fullName} ${member.email} ${member.phone} ${member.chapelName}`.toLocaleLowerCase().includes(term);
        const matchesStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" ? member.isActive : !member.isActive);
        return matchesTerm && matchesStatus;
      });
    }
    return activities.filter((activity) => !term || `${activity.title} ${activity.description} ${activity.location}`.toLocaleLowerCase().includes(term));
  }, [activities, isMembers, members, search, statusFilter]);

  const openCreate = () => {
    setSelected(null);
    setError("");
    setNotice("");
    setMemberDraft({ fullName: "", email: "", phone: "", country: "", city: "", churchStatus: "SIMPLE_FIDELE", chapelSlug: chapels[0]?.slug ?? "", password: "", confirmPassword: "", isActive: true, isApproved: true, isVerified: false });
    setActivityDraft({ title: "", description: "", date: "", location: "", chapelSlug: chapels[0]?.slug ?? "" });
    setModalMode("create");
  };

  const openEdit = (record: PastorMemberRecord | PastorActivityRecord) => {
    setSelected(record);
    setError("");
    if (isMembers) {
      const member = record as PastorMemberRecord;
      const chapelSlug = chapels.find((chapel) => chapel.id === member.chapelId)?.slug ?? "";
      setMemberDraft({ fullName: member.fullName, email: member.email, phone: member.phone, country: member.country, city: member.city, churchStatus: member.churchStatus, chapelSlug, password: "", confirmPassword: "", isActive: member.isActive, isApproved: member.isApproved, isVerified: member.isVerified });
    } else {
      const activity = record as PastorActivityRecord;
      setActivityDraft({ title: activity.title, description: activity.description, date: localDateValue(activity.date), location: activity.location, chapelSlug: "" });
    }
    setModalMode("edit");
  };

  const openView = (record: PastorMemberRecord | PastorActivityRecord) => {
    setSelected(record);
    setModalMode("view");
    setError("");
  };

  const closeModal = () => {
    if (isSaving) return;
    setModalMode(null);
    setSelected(null);
    setError("");
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setNotice("");
    try {
      if (isMembers) {
        if (modalMode === "create" && memberDraft.password !== memberDraft.confirmPassword) {
          throw new Error("La confirmation du mot de passe ne correspond pas.");
        }
        const payload: Record<string, string | boolean> = {
          fullName: memberDraft.fullName.trim(), email: memberDraft.email.trim(), phone: memberDraft.phone.trim(),
          country: memberDraft.country.trim(), city: memberDraft.city.trim(), churchStatus: memberDraft.churchStatus,
          isActive: memberDraft.isActive, isApproved: memberDraft.isApproved, isVerified: memberDraft.isVerified,
        };
        if (memberDraft.password) payload.password = memberDraft.password;
        if (isSuperAdmin) payload.chapelSlug = memberDraft.chapelSlug;
        if (modalMode === "edit" && selected) await api.pastor.updateMember((selected as PastorMemberRecord).id, payload);
        else await api.pastor.createMember(payload as Record<string, string>);
      } else {
        const payload: Record<string, string> = {
          title: activityDraft.title.trim(), description: activityDraft.description.trim(),
          date: new Date(activityDraft.date).toISOString(), location: activityDraft.location.trim(),
        };
        if (isSuperAdmin) payload.chapelSlug = activityDraft.chapelSlug;
        if (modalMode === "edit" && selected) await api.pastor.updateActivity((selected as PastorActivityRecord).id, payload);
        else await api.pastor.createActivity(payload);
      }
      setModalMode(null);
      setSelected(null);
      setNotice(modalMode === "edit" ? "Les modifications ont été enregistrées." : "L’élément a été créé avec succès.");
      await reload();
    } catch (saveError) {
      setError(errorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleMember(member: PastorMemberRecord, field: "isActive" | "isApproved" | "isVerified") {
    setError("");
    try {
      const payload: Record<string, string | boolean> = { [field]: !member[field] };
      await api.pastor.updateMember(member.id, payload);
      setNotice(`${field === "isActive" ? "Compte" : field === "isApproved" ? "Approbation" : "Vérification"} mis à jour.`);
      await reload();
    } catch (actionError) {
      setError(errorMessage(actionError));
    }
  }

  async function removeRecord(record: PastorMemberRecord | PastorActivityRecord) {
    const confirmation = isMembers
      ? `Désactiver le compte de ${ (record as PastorMemberRecord).fullName } ?`
      : `Supprimer l’activité « ${(record as PastorActivityRecord).title} » ?`;
    if (!window.confirm(confirmation)) return;
    setError("");
    try {
      if (isMembers) await api.pastor.deactivateMember((record as PastorMemberRecord).id);
      else await api.pastor.deleteActivity((record as PastorActivityRecord).id);
      setNotice(isMembers ? "Le membre a été désactivé. Son historique est conservé." : "L’activité a été supprimée.");
      await reload();
    } catch (deleteError) {
      setError(errorMessage(deleteError));
    }
  }

  function exportCsv() {
    const headings = isMembers ? ["Nom", "Email", "Téléphone", "Pays", "Ville", "Statut", "Chapelle", "Actif"] : ["Activité", "Description", "Date", "Lieu", "Chapelle"];
    const lines = isMembers
      ? (rows as PastorMemberRecord[]).map((row) => [row.fullName, row.email, row.phone, row.country, row.city, churchStatuses.find(([value]) => value === row.churchStatus)?.[1] ?? row.churchStatus, row.chapelName ?? "", row.isActive ? "Oui" : "Non"])
      : (rows as PastorActivityRecord[]).map((row) => [row.title, row.description, dateLabel(row.date), row.location, row.chapelName]);
    const csv = [headings, ...lines].map((line) => line.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${section}-clg.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const title = isMembers ? "Gestion des membres" : "Activités de la chapelle";
  const description = isMembers
    ? "Créez et gérez les comptes des membres de votre chapelle. Les accès sont limités à votre communauté."
    : "Planifiez et gérez les activités de votre chapelle depuis un calendrier centralisé.";

  return (
    <div className="space-y-7 pb-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold tracking-[.2em] text-blue-700"><span className="h-px w-6 bg-blue-600" />{isMembers ? "COMMUNAUTÉ" : "VIE DE LA CHAPELLE"}</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800"><Plus size={17} />{isMembers ? "Ajouter un membre" : "Créer une activité"}</button>
      </div>

      {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Fermer le message"><X size={16} /></button></div>}
      {error && !modalMode && <div role="alert" className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}<button type="button" onClick={() => setError("")} aria-label="Fermer le message"><X size={16} /></button></div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div><h3 className="font-extrabold text-slate-900">{isMembers ? "Tous les membres" : "Planning des activités"}</h3><p className="mt-1 text-xs text-slate-400">{rows.length} résultat(s) · informations chargées depuis l’API CLG</p></div>
          <div className="flex flex-wrap gap-2">
            <label className="flex min-w-[190px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 sm:flex-none"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher..." className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400 sm:w-40" /></label>
            {isMembers && <select aria-label="Filtrer les membres par statut" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600"><option value="ALL">Tous les comptes</option><option value="ACTIVE">Actifs</option><option value="INACTIVE">Désactivés</option></select>}
            <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"><Download size={15} /><span className="hidden sm:inline">Exporter</span></button>
            <button type="button" onClick={() => void reload()} aria-label="Actualiser" className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Actualiser</button>
          </div>
        </div>
        {error && <p role="alert" className="m-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50/80"><tr>{(isMembers ? ["Membre", "Statut de l’église", "Inscription", "Compte", "Actions"] : ["Activité", "Lieu", "Date & heure", "Statut", "Actions"]).map((heading) => <th key={heading} className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading && rows.map((row) => {
                const member = isMembers ? row as PastorMemberRecord : null;
                const activity = !isMembers ? row as PastorActivityRecord : null;
                const name = member?.fullName ?? activity?.title ?? "";
                const sub = member ? member.email : `${activity?.description || "Activité"} · ${activity?.chapelName ?? "Chapelle"}`;
                const statusText = member ? (!member.isActive ? "Désactivé" : !member.isApproved ? "En attente" : "Actif") : (new Date(activity!.date) >= new Date() ? "À venir" : "Terminé");
                const stateColor = statusText === "Actif" || statusText === "À venir" ? "bg-emerald-50 text-emerald-700" : statusText === "En attente" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600";
                return <tr key={`${section}-${row.id}`} className="transition hover:bg-blue-50/30">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700">{member ? <UserRound size={18} /> : <CalendarDays size={18} />}</span><div><p className="text-sm font-bold text-slate-800">{name}</p><p className="mt-1 text-xs text-slate-400">{sub}</p></div></div></td>
                  {member ? <td className="px-5 py-4 text-xs font-semibold text-slate-600">{churchStatuses.find(([value]) => value === member.churchStatus)?.[1] ?? member.churchStatus}</td> : <td className="px-5 py-4 text-xs font-semibold text-slate-600">{activity?.location || "À préciser"}</td>}
                  <td className="px-5 py-4 text-xs text-slate-500">{member ? dateLabel(member.dateJoined) : dateLabel(activity!.date)}</td>
                  <td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${stateColor}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{statusText}</span></td>
                  <td className="px-5 py-4"><div className="flex items-center gap-1">
                    <button type="button" aria-label={`Voir ${name}`} onClick={() => openView(row)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700"><Eye size={15} /></button>
                    <button type="button" aria-label={`Modifier ${name}`} onClick={() => openEdit(row)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700"><Pencil size={15} /></button>
                    {member && <details className="relative"><summary aria-label={`Actions supplémentaires pour ${name}`} className="flex cursor-pointer list-none items-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><ChevronDown size={16} /></summary><div className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                      <button type="button" onClick={() => void toggleMember(member, "isApproved")} className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">{member.isApproved ? "Retirer l’approbation" : "Approuver le membre"}</button>
                      <button type="button" onClick={() => void toggleMember(member, "isVerified")} className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">{member.isVerified ? "Retirer la vérification" : "Marquer comme vérifié"}</button>
                      <button type="button" onClick={() => void toggleMember(member, "isActive")} className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-amber-700 hover:bg-amber-50">{member.isActive ? "Désactiver le compte" : "Réactiver le compte"}</button>
                      <button type="button" onClick={() => void removeRecord(member)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50"><Trash2 size={14} />Désactiver et conserver l’historique</button>
                    </div></details>}
                    {activity && <button type="button" aria-label={`Supprimer ${name}`} onClick={() => void removeRecord(activity)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700"><Trash2 size={15} /></button>}
                  </div></td>
                </tr>;
              })}
            </tbody>
          </table>
          {isLoading && <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={18} />Chargement des données…</div>}
          {!isLoading && rows.length === 0 && <div className="p-12 text-center text-sm text-slate-400">Aucun élément ne correspond à votre recherche.</div>}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-400"><span>Affichage de {rows.length} élément(s)</span><span>Source : API CLG</span></div>
      </section>

      {modalMode && <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="pastor-form-title" className="my-auto max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7"><div><h3 id="pastor-form-title" className="text-lg font-extrabold text-slate-900">{modalMode === "view" ? (isMembers ? "Fiche membre" : "Détail de l’activité") : modalMode === "edit" ? (isMembers ? "Modifier le membre" : "Modifier l’activité") : isMembers ? "Ajouter un membre" : "Créer une activité"}</h3><p className="mt-1 text-xs text-slate-500">{modalMode === "view" ? "Informations enregistrées dans la base CLG." : "Les champs marqués * sont obligatoires."}</p></div><button type="button" aria-label="Fermer" onClick={closeModal} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button></header>
          {modalMode === "view" ? <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">{isMembers ? (() => { const member = selected as PastorMemberRecord; return <><Detail label="Nom complet" value={member.fullName} /><Detail label="E-mail" value={member.email} /><Detail label="Téléphone" value={member.phone} /><Detail label="Pays" value={member.country} /><Detail label="Ville" value={member.city} /><Detail label="Statut dans l’église" value={churchStatuses.find(([value]) => value === member.churchStatus)?.[1] ?? member.churchStatus} /><Detail label="Chapelle" value={member.chapelName ?? "Aucune"} /><Detail label="Date d’inscription" value={dateLabel(member.dateJoined)} /><Detail label="Compte actif" value={member.isActive ? "Oui" : "Non"} /><Detail label="Approuvé / vérifié" value={`${member.isApproved ? "Approuvé" : "À approuver"} · ${member.isVerified ? "Vérifié" : "Non vérifié"}`} /></>; })() : (() => { const activity = selected as PastorActivityRecord; return <><Detail label="Titre" value={activity.title} /><Detail label="Date" value={dateLabel(activity.date)} /><Detail label="Lieu" value={activity.location || "Non précisé"} /><Detail label="Chapelle" value={activity.chapelName} /><div className="sm:col-span-2"><Detail label="Description" value={activity.description || "Aucune description"} /></div></>; })()}</div> : <form onSubmit={submit} className="space-y-5 p-5 sm:p-7">
            {isMembers ? <>
              <div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Nom complet *<input className={fieldClass} autoComplete="name" required maxLength={255} value={memberDraft.fullName} onChange={(event) => setMemberDraft({ ...memberDraft, fullName: event.target.value })} /></label><label className={labelClass}>Adresse e-mail *<input className={fieldClass} type="email" autoComplete="email" required value={memberDraft.email} onChange={(event) => setMemberDraft({ ...memberDraft, email: event.target.value })} /></label><label className={labelClass}>Téléphone *<input className={fieldClass} type="tel" autoComplete="tel" required maxLength={30} value={memberDraft.phone} onChange={(event) => setMemberDraft({ ...memberDraft, phone: event.target.value })} /></label><label className={labelClass}>Pays *<input className={fieldClass} autoComplete="country-name" required maxLength={100} value={memberDraft.country} onChange={(event) => setMemberDraft({ ...memberDraft, country: event.target.value })} /></label><label className={labelClass}>Ville *<input className={fieldClass} autoComplete="address-level2" required maxLength={150} value={memberDraft.city} onChange={(event) => setMemberDraft({ ...memberDraft, city: event.target.value })} /></label><label className={labelClass}>Statut dans l’église *<select className={fieldClass} value={memberDraft.churchStatus} onChange={(event) => setMemberDraft({ ...memberDraft, churchStatus: event.target.value })}>{churchStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                {isSuperAdmin && <label className={`${labelClass} sm:col-span-2`}>Chapelle *<select className={fieldClass} required value={memberDraft.chapelSlug} onChange={(event) => setMemberDraft({ ...memberDraft, chapelSlug: event.target.value })}><option value="">Choisir une chapelle</option>{chapels.map((chapel) => <option key={chapel.slug} value={chapel.slug}>{chapel.name} · {chapel.city}</option>)}</select></label>}
                {modalMode === "create" && <><label className={labelClass}>Mot de passe temporaire *<input className={fieldClass} type="password" autoComplete="new-password" required minLength={8} value={memberDraft.password} onChange={(event) => setMemberDraft({ ...memberDraft, password: event.target.value })} /></label><label className={labelClass}>Confirmer le mot de passe *<input className={fieldClass} type="password" autoComplete="new-password" required minLength={8} value={memberDraft.confirmPassword} onChange={(event) => setMemberDraft({ ...memberDraft, confirmPassword: event.target.value })} /></label></>}
                {modalMode === "edit" && <label className={`${labelClass} sm:col-span-2`}>Nouveau mot de passe (facultatif)<input className={fieldClass} type="password" autoComplete="new-password" minLength={8} value={memberDraft.password} onChange={(event) => setMemberDraft({ ...memberDraft, password: event.target.value })} /><span className="mt-1 block font-normal text-slate-400">Laissez vide pour conserver le mot de passe actuel.</span></label>}
              </div>
              {modalMode === "edit" && <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">{([["isActive", "Compte actif"], ["isApproved", "Compte approuvé"], ["isVerified", "Identité vérifiée"]] as const).map(([field, label]) => <label key={field} className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={memberDraft[field]} onChange={(event) => setMemberDraft({ ...memberDraft, [field]: event.target.checked })} className="h-4 w-4 accent-blue-700" />{label}</label>)}</div>}
            </> : <div className="grid gap-4 sm:grid-cols-2"><label className={`${labelClass} sm:col-span-2`}>Nom de l’activité *<input className={fieldClass} required maxLength={255} value={activityDraft.title} onChange={(event) => setActivityDraft({ ...activityDraft, title: event.target.value })} /></label><label className={labelClass}>Date et heure *<input className={fieldClass} type="datetime-local" required value={activityDraft.date} onChange={(event) => setActivityDraft({ ...activityDraft, date: event.target.value })} /></label><label className={labelClass}>Lieu<input className={fieldClass} maxLength={255} value={activityDraft.location} onChange={(event) => setActivityDraft({ ...activityDraft, location: event.target.value })} /></label><label className={`${labelClass} sm:col-span-2`}>Description<textarea className={fieldClass} rows={4} value={activityDraft.description} onChange={(event) => setActivityDraft({ ...activityDraft, description: event.target.value })} /></label>{isSuperAdmin && <label className={`${labelClass} sm:col-span-2`}>Chapelle *<select className={fieldClass} required value={activityDraft.chapelSlug} onChange={(event) => setActivityDraft({ ...activityDraft, chapelSlug: event.target.value })}><option value="">Choisir une chapelle</option>{chapels.map((chapel) => <option key={chapel.slug} value={chapel.slug}>{chapel.name} · {chapel.city}</option>)}</select></label>}</div>}
            {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
            <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={isSaving} onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button><button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{isSaving ? "Enregistrement…" : modalMode === "edit" ? "Enregistrer les changements" : "Créer"}</button></footer>
          </form>}
        </section>
      </div>}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p></div>;
}
