"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AudioLines, BookOpen, CalendarDays, Check, ChevronDown, CirclePlay, Download, Eye, FileAudio, FileText, Film, LoaderCircle, Pencil, Plus, Search, Trash2, Upload, Video, X } from "lucide-react";
import { api, type PastorPreacherChoice, type PastorSermonChapelChoice, type PastorSermonRecord } from "@/lib/api";

type MediaType = "TEXT" | "AUDIO" | "VIDEO";
type Draft = {
  title: string;
  description: string;
  content: string;
  chapelSlug: string;
  preacherId: string;
  date: string;
  mediaType: MediaType;
  isPublished: boolean;
};

const fieldClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";
const labelClass = "block text-xs font-bold text-slate-600";
const mediaOptions: { value: MediaType; label: string; icon: typeof Video; helper: string }[] = [
  { value: "VIDEO", label: "Vidéo", icon: Video, helper: "MP4, MOV ou WEBM · 500 Mo max" },
  { value: "AUDIO", label: "Audio", icon: AudioLines, helper: "MP3, M4A, WAV ou OGG · 100 Mo max" },
  { value: "TEXT", label: "Texte", icon: FileText, helper: "Texte intégral de l’enseignement" },
];

function toLocalInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function toDateLabel(value: string) {
  return new Date(value).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function mediaLabel(type: MediaType) {
  return mediaOptions.find((option) => option.value === type)?.label ?? "Texte";
}

function errorText(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue. Réessayez.";
}

function getMediaType(sermon: PastorSermonRecord): MediaType {
  return sermon.mediaType ?? (sermon.videoUrl ? "VIDEO" : sermon.audioUrl ? "AUDIO" : "TEXT");
}

function emptyDraft(chapels: PastorSermonChapelChoice[], now = new Date()): Draft {
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  return { title: "", description: "", content: "", chapelSlug: chapels[0]?.slug ?? "", preacherId: "", date: localDate, mediaType: "TEXT", isPublished: false };
}

export default function PastorSermonsSection() {
  const [sermons, setSermons] = useState<PastorSermonRecord[]>([]);
  const [chapels, setChapels] = useState<PastorSermonChapelChoice[]>([]);
  const [preachers, setPreachers] = useState<PastorPreacherChoice[]>([]);
  const [search, setSearch] = useState("");
  const [mediaFilter, setMediaFilter] = useState("ALL");
  const [publicationFilter, setPublicationFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [loadingPreachers, setLoadingPreachers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<"create" | "edit" | "view" | null>(null);
  const [selected, setSelected] = useState<PastorSermonRecord | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft([]));
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [removeThumbnail, setRemoveThumbnail] = useState(false);
  const [existingMediaRemoved, setExistingMediaRemoved] = useState(false);

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const records = await api.pastor.sermons();
      setSermons(records);
    } catch (loadError) {
      setError(errorText(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([api.pastor.sermonChapels(), api.pastor.sermons()]).then(([chapelItems, sermonItems]) => {
      if (active) {
        setChapels(chapelItems);
        setSermons(sermonItems);
      }
    }).catch((loadError: unknown) => {
      if (active) setError(errorText(loadError));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (!draft.chapelSlug || dialog === "view") {
      setPreachers([]);
      return () => { active = false; };
    }
    setLoadingPreachers(true);
    api.pastor.sermonPreachers(draft.chapelSlug).then((items) => {
      if (active) {
        setPreachers(items);
        setDraft((current) => ({
          ...current,
          preacherId: items.some((item) => String(item.id) === current.preacherId)
            ? current.preacherId
            : items.length === 1 ? String(items[0].id) : "",
        }));
      }
    }).catch((loadError: unknown) => {
      if (active) {
        setPreachers([]);
        setError(errorText(loadError));
      }
    }).finally(() => {
      if (active) setLoadingPreachers(false);
    });
    return () => { active = false; };
  }, [draft.chapelSlug, dialog]);

  const rows = useMemo(() => sermons.filter((sermon) => {
    const term = search.trim().toLocaleLowerCase();
    const matchesSearch = !term || `${sermon.title} ${sermon.description} ${sermon.preacher} ${sermon.chapelName}`.toLocaleLowerCase().includes(term);
    const matchesMedia = mediaFilter === "ALL" || getMediaType(sermon) === mediaFilter;
    const matchesPublication = publicationFilter === "ALL" || (publicationFilter === "PUBLISHED" ? sermon.isPublished : !sermon.isPublished);
    return matchesSearch && matchesMedia && matchesPublication;
  }), [mediaFilter, publicationFilter, search, sermons]);

  const openCreate = () => {
    setSelected(null);
    setDraft(emptyDraft(chapels));
    setVideoFile(null);
    setAudioFile(null);
    setThumbnailFile(null);
    setRemoveThumbnail(false);
    setExistingMediaRemoved(false);
    setError("");
    setNotice("");
    setDialog("create");
  };

  const openEdit = (sermon: PastorSermonRecord) => {
    setSelected(sermon);
    setDraft({ title: sermon.title, description: sermon.description, content: sermon.content, chapelSlug: sermon.chapelSlug ?? "", preacherId: String(sermon.preacherId), date: toLocalInput(sermon.date), mediaType: getMediaType(sermon), isPublished: sermon.isPublished });
    setVideoFile(null);
    setAudioFile(null);
    setThumbnailFile(null);
    setRemoveThumbnail(false);
    setExistingMediaRemoved(false);
    setError("");
    setDialog("edit");
  };

  const closeDialog = () => {
    if (saving) return;
    setDialog(null);
    setSelected(null);
    setError("");
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = new FormData();
      payload.set("title", draft.title.trim());
      payload.set("description", draft.description.trim());
      payload.set("content", draft.content.trim());
      payload.set("chapelSlug", draft.chapelSlug);
      payload.set("preacherId", draft.preacherId);
      payload.set("date", new Date(draft.date).toISOString());
      payload.set("mediaType", draft.mediaType);
      payload.set("isPublished", String(draft.isPublished));
      if (videoFile) payload.set("videoFile", videoFile);
      if (audioFile) payload.set("audioFile", audioFile);
      if (thumbnailFile) payload.set("thumbnailFile", thumbnailFile);
      if (removeThumbnail) payload.set("removeThumbnail", "true");
      if (existingMediaRemoved) payload.set("removeMedia", "true");
      if (dialog === "edit" && selected) await api.pastor.updateSermon(selected.id, payload);
      else await api.pastor.createSermon(payload);
      setDialog(null);
      setSelected(null);
      setNotice(dialog === "edit" ? "La prédication a été mise à jour." : "La prédication a été enregistrée.");
      await reload();
    } catch (saveError) {
      setError(errorText(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function removeSermon(sermon: PastorSermonRecord) {
    if (!window.confirm(`Supprimer définitivement « ${sermon.title} » et ses fichiers associés ?`)) return;
    setError("");
    try {
      await api.pastor.deleteSermon(sermon.id);
      setNotice("La prédication et ses fichiers ont été supprimés.");
      await reload();
    } catch (deleteError) {
      setError(errorText(deleteError));
    }
  }

  async function togglePublished(sermon: PastorSermonRecord) {
    const payload = new FormData();
    payload.set("isPublished", String(!sermon.isPublished));
    payload.set("title", sermon.title);
    payload.set("chapelSlug", sermon.chapelSlug ?? "");
    payload.set("preacherId", String(sermon.preacherId));
    payload.set("date", sermon.date);
    payload.set("mediaType", getMediaType(sermon));
    payload.set("content", sermon.content);
    payload.set("description", sermon.description);
    setError("");
    try {
      await api.pastor.updateSermon(sermon.id, payload);
      setNotice(sermon.isPublished ? "La prédication a été dépubliée." : "La prédication est publiée.");
      await reload();
    } catch (updateError) {
      setError(errorText(updateError));
    }
  }

  const exportCsv = () => {
    const rowsForExport = [["Titre", "Pasteur", "Chapelle", "Date", "Format", "Publication"], ...rows.map((sermon) => [sermon.title, sermon.preacher, sermon.chapelName ?? "", toDateLabel(sermon.date), mediaLabel(getMediaType(sermon)), sermon.isPublished ? "Publié" : "Brouillon"])] as string[][];
    const csv = rowsForExport.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "predications-clg.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const selectedChapel = chapels.find((chapel) => chapel.slug === draft.chapelSlug);
  const selectedPreacher = preachers.find((preacher) => String(preacher.id) === draft.preacherId);

  return <div className="space-y-7 pb-8">
    <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold tracking-[.2em] text-blue-700"><span className="h-px w-6 bg-blue-600" />RESSOURCES SPIRITUELLES</p><h2 className="text-3xl font-black tracking-tight text-slate-900">Prédications</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Gérez les enseignements texte, audio et vidéo, associés à leur chapelle et à leur pasteur.</p></div><button type="button" onClick={openCreate} disabled={!chapels.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17} />Ajouter une prédication</button></header>

    {notice && <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}<button type="button" aria-label="Fermer" onClick={() => setNotice("")}><X size={16} /></button></div>}
    {error && !dialog && <div role="alert" className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}<button type="button" aria-label="Fermer" onClick={() => setError("")}><X size={16} /></button></div>}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      { label: "Total", value: sermons.length, icon: BookOpen, tone: "bg-blue-50 text-blue-700" },
      { label: "Publiées", value: sermons.filter((sermon) => sermon.isPublished).length, icon: CirclePlay, tone: "bg-emerald-50 text-emerald-700" },
      { label: "Brouillons", value: sermons.filter((sermon) => !sermon.isPublished).length, icon: FileText, tone: "bg-amber-50 text-amber-700" },
      { label: "Médias", value: sermons.filter((sermon) => getMediaType(sermon) !== "TEXT").length, icon: Film, tone: "bg-violet-50 text-violet-700" },
    ].map((stat) => <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">{stat.label}</span><span className={`rounded-xl p-2.5 ${stat.tone}`}><stat.icon size={17} /></span></div><p className="mt-3 text-2xl font-black text-slate-900">{stat.value}</p><p className="mt-1 text-[11px] text-slate-400">Données réelles de la base CLG</p></article>)}</section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center"><div><h3 className="font-extrabold text-slate-900">Bibliothèque des prédications</h3><p className="mt-1 text-xs text-slate-400">{rows.length} élément(s) · chapelle, pasteur et format inclus</p></div><div className="flex flex-wrap gap-2"><label className="flex min-w-[190px] flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 xl:flex-none"><Search size={16} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Titre, pasteur, chapelle…" className="w-full bg-transparent text-xs outline-none sm:w-52" /></label><select aria-label="Filtrer par format" value={mediaFilter} onChange={(event) => setMediaFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600"><option value="ALL">Tous les formats</option><option value="VIDEO">Vidéo</option><option value="AUDIO">Audio</option><option value="TEXT">Texte</option></select><select aria-label="Filtrer par publication" value={publicationFilter} onChange={(event) => setPublicationFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600"><option value="ALL">Tous les statuts</option><option value="PUBLISHED">Publiées</option><option value="DRAFT">Brouillons</option></select><button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"><Download size={15} /><span className="hidden sm:inline">Exporter</span></button><button type="button" onClick={() => void reload()} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">Actualiser</button></div></div>
      {error && !dialog && <p role="alert" className="mx-5 mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
      <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left"><thead className="bg-slate-50/80"><tr>{["Prédication", "Pasteur / chapelle", "Date", "Format", "Publication", "Actions"].map((heading) => <th key={heading} className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[.13em] text-slate-400">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{!loading && rows.map((sermon) => {const mediaType = getMediaType(sermon); const MediaIcon = mediaType === "VIDEO" ? Video : mediaType === "AUDIO" ? FileAudio : FileText; return <tr key={sermon.id} className="transition hover:bg-blue-50/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-700"><MediaIcon size={19} /></span><div><p className="max-w-[300px] truncate text-sm font-bold text-slate-800">{sermon.title}</p><p className="mt-1 max-w-[300px] truncate text-xs text-slate-400">{sermon.description || (sermon.content ? sermon.content.slice(0, 90) : "Aucune description")}</p></div></div></td><td className="px-5 py-4"><p className="text-xs font-bold text-slate-700">{sermon.preacher || "Pasteur non renseigné"}</p><p className="mt-1 text-[11px] text-slate-400">{sermon.chapelName || "Chapelle non renseignée"}</p></td><td className="px-5 py-4 text-xs text-slate-500">{toDateLabel(sermon.date)}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-blue-700"><MediaIcon size={12} />{mediaLabel(mediaType)}</span></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1.5 text-[10px] font-bold ${sermon.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{sermon.isPublished ? "Publiée" : "Brouillon"}</span></td><td className="px-5 py-4"><div className="flex items-center gap-1"><button type="button" aria-label={`Voir ${sermon.title}`} onClick={() => { setSelected(sermon); setDialog("view"); }} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700"><Eye size={15} /></button><button type="button" aria-label={`Modifier ${sermon.title}`} onClick={() => openEdit(sermon)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700"><Pencil size={15} /></button><details className="relative"><summary aria-label={`Autres actions pour ${sermon.title}`} className="flex cursor-pointer list-none rounded-lg p-2 text-slate-400 hover:bg-slate-100"><ChevronDown size={16} /></summary><div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"><button type="button" onClick={() => void togglePublished(sermon)} className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50">{sermon.isPublished ? "Dépublier" : "Publier"}</button><button type="button" onClick={() => void removeSermon(sermon)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50"><Trash2 size={14} />Supprimer</button></div></details></div></td></tr>; })}</tbody></table>{loading && <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500"><LoaderCircle size={18} className="animate-spin" />Chargement des prédications…</div>}{!loading && !rows.length && <div className="p-12 text-center text-sm text-slate-400">Aucune prédication ne correspond aux filtres.</div>}</div><div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-xs text-slate-400"><span>{rows.length} prédication(s) affichée(s)</span><span>Source : base de données CLG</span></div></section>

    {dialog && <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) closeDialog(); }}><section role="dialog" aria-modal="true" aria-labelledby="sermon-dialog-title" className="my-auto max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-7"><div><h3 id="sermon-dialog-title" className="text-lg font-extrabold text-slate-900">{dialog === "view" ? "Détail de la prédication" : dialog === "edit" ? "Modifier la prédication" : "Ajouter une prédication"}</h3><p className="mt-1 text-xs text-slate-500">Associez un pasteur de la chapelle et choisissez le format du message.</p></div><button type="button" aria-label="Fermer" onClick={closeDialog} disabled={saving} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button></header>
      {dialog === "view" && selected ? <div className="space-y-5 p-5 sm:p-7"><div className="grid gap-3 sm:grid-cols-2"><Info label="Titre" value={selected.title} /><Info label="Chapelle" value={selected.chapelName ?? "—"} /><Info label="Pasteur" value={selected.preacher || "—"} /><Info label="Date" value={toDateLabel(selected.date)} /><Info label="Format" value={mediaLabel(getMediaType(selected))} /><Info label="État" value={selected.isPublished ? "Publiée" : "Brouillon"} /></div>{selected.description && <Info label="Description" value={selected.description} />}{getMediaType(selected) === "TEXT" && <article className="rounded-xl border border-slate-200 p-4"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Texte intégral</p><p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{selected.content}</p></article>}{selected.videoUrl && <video controls className="max-h-[55dvh] w-full rounded-xl bg-black" src={selected.videoUrl} poster={selected.thumbnailUrl ?? undefined} />} {selected.audioUrl && <audio controls className="w-full" src={selected.audioUrl} />}{selected.thumbnailUrl && !selected.videoUrl && <img src={selected.thumbnailUrl} alt={`Couverture de ${selected.title}`} className="max-h-64 rounded-xl object-cover" />}<div className="flex justify-end"><button type="button" onClick={closeDialog} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">Fermer</button></div></div> : dialog !== "view" && <form onSubmit={submit} className="space-y-5 p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Titre de la prédication *<input className={fieldClass} required maxLength={255} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Ex. La foi qui déplace les montagnes" /></label><label className={labelClass}>Date et heure *<input className={fieldClass} type="datetime-local" required value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label><label className={labelClass}>Chapelle *<select className={fieldClass} required value={draft.chapelSlug} onChange={(event) => setDraft({ ...draft, chapelSlug: event.target.value, preacherId: "" })}><option value="">Sélectionner une chapelle</option>{chapels.map((chapel) => <option key={chapel.slug} value={chapel.slug}>{chapel.name} · {chapel.city}</option>)}</select></label><label className={labelClass}>Pasteur / prédicateur *<select className={fieldClass} required disabled={!draft.chapelSlug || loadingPreachers || !preachers.length} value={draft.preacherId} onChange={(event) => setDraft({ ...draft, preacherId: event.target.value })}><option value="">{loadingPreachers ? "Chargement des pasteurs…" : !draft.chapelSlug ? "Choisissez d’abord une chapelle" : !preachers.length ? "Aucun pasteur associé à cette chapelle" : "Sélectionner un pasteur"}</option>{preachers.map((preacher) => <option key={preacher.id} value={preacher.id}>{preacher.fullName} · {preacher.churchStatus === "PASTEUR" ? "Pasteur" : preacher.systemRole === "PASTOR_ADMIN" ? "Administrateur pasteur" : preacher.email}</option>)}</select></label><label className={`${labelClass} sm:col-span-2`}>Description<textarea className={fieldClass} rows={2} maxLength={5000} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Résumé de l’enseignement, verset principal…" /></label></div>
        <fieldset><legend className="text-xs font-bold text-slate-600">Format du contenu *</legend><div className="mt-2 grid gap-3 sm:grid-cols-3">{mediaOptions.map((option) => {const Icon = option.icon; return <label key={option.value} className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${draft.mediaType === option.value ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:bg-slate-50"}`}><input type="radio" name="mediaType" value={option.value} checked={draft.mediaType === option.value} onChange={() => { setDraft({ ...draft, mediaType: option.value }); setExistingMediaRemoved(false); }} className="mt-1 accent-blue-700" /><span className="rounded-lg bg-white p-2 text-blue-700 shadow-sm"><Icon size={18} /></span><span><span className="block text-sm font-bold text-slate-800">{option.label}</span><span className="mt-1 block text-[10px] leading-4 text-slate-500">{option.helper}</span></span></label>; })}</div></fieldset>
        {draft.mediaType === "TEXT" ? <label className={labelClass}>Texte intégral *<textarea className={`${fieldClass} min-h-48`} required rows={8} value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder="Rédigez ou collez le texte complet de la prédication…" /></label> : <div className="space-y-4"><label className={labelClass}>{draft.mediaType === "VIDEO" ? "Fichier vidéo" : "Fichier audio"} {dialog === "create" && "*"}<span className="relative mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/40"><Upload size={22} className="text-blue-700" /><span className="mt-2 text-sm font-bold text-slate-700">Cliquez pour choisir un fichier</span><span className="mt-1 text-xs text-slate-400">{draft.mediaType === "VIDEO" ? "MP4, MOV, WEBM" : "MP3, M4A, WAV, OGG"}</span><input className="absolute inset-0 cursor-pointer opacity-0" type="file" accept={draft.mediaType === "VIDEO" ? "video/mp4,video/quicktime,video/webm" : "audio/mpeg,audio/mp4,audio/wav,audio/ogg"} required={dialog === "create" || existingMediaRemoved} onChange={(event) => { const file = event.target.files?.[0] ?? null; if (draft.mediaType === "VIDEO") setVideoFile(file); else setAudioFile(file); setExistingMediaRemoved(false); }} /></span></label>{(videoFile || audioFile || (dialog === "edit" && (draft.mediaType === "VIDEO" ? selected?.videoUrl : selected?.audioUrl))) && <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50 p-3 text-xs text-blue-800"><span className="truncate">{videoFile?.name || audioFile?.name || `Fichier actuel : ${draft.mediaType === "VIDEO" ? "vidéo" : "audio"}`}</span>{dialog === "edit" && <button type="button" onClick={() => { setVideoFile(null); setAudioFile(null); setExistingMediaRemoved(true); }} className="font-bold text-rose-700">Remplacer le média</button>}</div>}</div>}
        <div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Image de couverture (facultatif)<input className={`${fieldClass} file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-blue-700`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setThumbnailFile(event.target.files?.[0] ?? null)} /></label><label className="flex items-center gap-3 self-end rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-700"><input type="checkbox" checked={draft.isPublished} onChange={(event) => setDraft({ ...draft, isPublished: event.target.checked })} className="h-4 w-4 accent-blue-700" />Publier immédiatement et rendre visible sur le site</label></div>
        {selectedChapel && selectedPreacher && <p className="rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-800"><strong>{selectedChapel.name}</strong> · {selectedPreacher.fullName} · {selectedChapel.city}, {selectedChapel.country}</p>}
        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
        <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" disabled={saving} onClick={closeDialog} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Annuler</button><button type="submit" disabled={saving || loadingPreachers || !preachers.length} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{saving ? "Enregistrement…" : dialog === "edit" ? "Enregistrer les modifications" : "Enregistrer la prédication"}</button></footer>
      </form>}
    </section></div>}
  </div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-slate-800">{value}</p></div>;
}
