"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, api } from "@/lib/api";
import type { Chapel } from "@/types/content";
import type { UserProfile } from "@/types/user";

const soulStatusLabels: Record<string, string> = {
	SIMPLE_FIDELE: "Simple fidèle",
	ASPIRANT: "Aspirant",
	DIACRE: "Diacre",
	ENUQUE: "Énuque",
	PASTEUR: "Pasteur",
	INSTRUMENTISTE: "Instrumentiste",
	CHORISTE: "Choriste",
	"MONITEUR/TRICE": "Moniteur/trice",
	EVANGELISTE: "Évangéliste",
};

function initials(fullName: string): string {
	return fullName
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toLocaleUpperCase() ?? "")
		.join("") || "CLG";
}

function ErrorMessage({ children }: { children: string }) {
	return (
		<p role="alert" className="rounded-xl border border-crimson-100 bg-red-50 px-4 py-3 text-sm text-crimson-700">
			{children}
		</p>
	);
}

function SuccessMessage({ children }: { children: string }) {
	return (
		<p role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
			{children}
		</p>
	);
}

const inputClassName =
	"mt-2 w-full rounded-xl border border-royal-100 bg-white px-4 py-3 text-sm text-charcoal shadow-sm transition placeholder:text-slate-light hover:border-royal-300 focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal-100 disabled:cursor-not-allowed disabled:bg-paper-dark";

export default function MemberProfilePage() {
	const router = useRouter();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [chapels, setChapels] = useState<Chapel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);
	const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [removePhoto, setRemovePhoto] = useState(false);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);
	const [passwordError, setPasswordError] = useState<string | null>(null);
	const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	useEffect(() => {
		let active = true;

		async function loadProfile() {
			if (!api.auth.currentSession()?.access) {
				router.replace("/login");
				return;
			}

			try {
				const [member, availableChapels] = await Promise.all([
					api.auth.profile(),
					api.content.chapels().catch(() => [] as Chapel[]),
				]);
				if (active) {
					setProfile(member);
					setChapels(availableChapels);
				}
			} catch (error) {
				if (error instanceof ApiError && error.status === 401) {
					api.auth.logout();
					router.replace("/login");
				} else if (active) {
					setLoadError(error instanceof Error ? error.message : "Impossible de charger votre profil.");
				}
			} finally {
				if (active) setIsLoading(false);
			}
		}

		void loadProfile();
		return () => {
			active = false;
		};
	}, [router]);

	async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!profile) return;

		setIsSaving(true);
		setSaveError(null);
		setSaveSuccess(null);

		const form = new FormData(event.currentTarget);
		const payload = new FormData();
		["fullName", "email", "phone", "country", "city", "chapelSlug"].forEach((field) => {
			payload.set(field, String(form.get(field) ?? ""));
		});
		if (photoFile) payload.set("profilePhotoUpload", photoFile);
		if (removePhoto) payload.set("removeProfilePhoto", "true");

		try {
			const updatedProfile = await api.auth.updateProfile(payload);
			setProfile(updatedProfile);
			api.auth.updateCachedUser(updatedProfile);
			setPhotoFile(null);
			setRemovePhoto(false);
			setPhotoPreview(null);
			setSaveSuccess("Vos informations ont été enregistrées.");
		} catch (error) {
			if (error instanceof ApiError && error.status === 401) {
				api.auth.logout();
				router.replace("/login");
			} else {
				setSaveError(error instanceof Error ? error.message : "La mise à jour a échoué.");
			}
		} finally {
			setIsSaving(false);
		}
	}

	async function changePassword(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formElement = event.currentTarget;
		setIsChangingPassword(true);
		setPasswordError(null);
		setPasswordSuccess(null);
		const form = new FormData(formElement);
		const newPassword = String(form.get("newPassword") ?? "");
		const confirmation = String(form.get("confirmPassword") ?? "");

		if (newPassword !== confirmation) {
			setPasswordError("La confirmation ne correspond pas au nouveau mot de passe.");
			setIsChangingPassword(false);
			return;
		}

		try {
			const response = await api.auth.changePassword({
				currentPassword: String(form.get("currentPassword") ?? ""),
				newPassword,
			});
			formElement.reset();
			setPasswordSuccess(response.message ?? "Votre mot de passe a été modifié.");
		} catch (error) {
			setPasswordError(error instanceof Error ? error.message : "Le changement de mot de passe a échoué.");
		} finally {
			setIsChangingPassword(false);
		}
	}

	if (isLoading) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-paper-light px-6 text-slate">
				<p role="status" aria-live="polite">Chargement de votre profil…</p>
			</main>
		);
	}

	if (!profile) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-paper-light px-6">
				<section className="w-full max-w-md rounded-2xl border border-royal-100 bg-white p-8 text-center shadow-sm">
					<h1 className="font-display text-2xl font-semibold text-royal">Profil indisponible</h1>
					<p className="mt-3 text-sm leading-6 text-slate">{loadError ?? "Connectez-vous pour gérer vos informations."}</p>
					<Link href="/login" className="mt-6 inline-flex rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white hover:bg-royal-700">
						Se connecter
					</Link>
				</section>
			</main>
		);
	}

	const memberName = profile.fullName || profile.email;
	const visiblePhoto = photoPreview ?? (!removePhoto ? profile.profilePhoto : null);

	return (
		<main className="min-h-screen bg-paper-light text-charcoal">
			<header className="border-b border-royal-100 bg-white">
				<div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
					<Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-royal-700 transition hover:text-royal-900">
						<span aria-hidden="true">←</span> Retour au tableau de bord
					</Link>
					<span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-slate sm:block">Espace membre CLG</span>
				</div>
			</header>

			<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
				<div className="mb-8 max-w-2xl">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-crimson">Mon espace</p>
					<h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-royal sm:text-4xl">Mon profil</h1>
					<p className="mt-3 text-sm leading-6 text-slate sm:text-base">
						Gérez vos coordonnées, votre appartenance à une chapelle et la sécurité de votre compte.
					</p>
				</div>

				<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
					<div className="space-y-6">
						<section className="overflow-hidden rounded-2xl border border-royal-100 bg-white shadow-sm">
							<div className="border-b border-royal-100 px-5 py-5 sm:px-7">
								<h2 className="font-display text-xl font-semibold text-royal">Informations personnelles</h2>
								<p className="mt-1 text-sm text-slate">Ces informations servent à vous contacter et à vous identifier dans la communauté.</p>
							</div>

							<form onSubmit={saveProfile} className="p-5 sm:p-7">
								<div className="mb-8 flex flex-col gap-5 rounded-2xl bg-paper-light p-4 sm:flex-row sm:items-center sm:p-5">
									<div
										role="img"
										aria-label={visiblePhoto ? `Photo de profil de ${memberName}` : `Initiales de ${memberName}`}
										className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-royal-100 bg-cover bg-center text-2xl font-bold text-royal shadow-sm"
										style={visiblePhoto ? { backgroundImage: `url("${visiblePhoto}")` } : undefined}
									>
										{!visiblePhoto && initials(memberName)}
									</div>
									<div className="min-w-0 flex-1">
										<p className="font-semibold text-royal-900">Photo de profil</p>
										<p className="mt-1 text-sm leading-5 text-slate">Image JPG, PNG ou WebP, jusqu’à 5 Mo.</p>
										<div className="mt-3 flex flex-wrap items-center gap-3">
											<label className="inline-flex cursor-pointer items-center rounded-lg border border-royal-100 bg-white px-3 py-2 text-sm font-semibold text-royal-700 hover:border-royal-300 hover:bg-royal-50">
												Choisir une photo
												<input
													type="file"
													accept="image/jpeg,image/png,image/webp"
													className="sr-only"
													onChange={(event) => {
														const selected = event.currentTarget.files?.[0] ?? null;
														setPhotoFile(selected);
														if (selected) {
															setRemovePhoto(false);
															const reader = new FileReader();
															reader.onload = () => setPhotoPreview(typeof reader.result === "string" ? reader.result : null);
															reader.readAsDataURL(selected);
														} else {
															setPhotoPreview(null);
														}
													}}
												/>
											</label>
											{(profile.profilePhoto || photoFile) && (
												<button
													type="button"
													onClick={() => {
														setPhotoFile(null);
														setPhotoPreview(null);
														setRemovePhoto(true);
													}}
													className="text-sm font-medium text-crimson-700 hover:underline"
												>
													Supprimer la photo
												</button>
											)}
											{photoFile && <span className="max-w-full truncate text-xs text-slate">{photoFile.name}</span>}
										</div>
									</div>
								</div>

								<div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
									<label className="block text-sm font-medium text-charcoal">
										Nom complet <span className="text-crimson">*</span>
										<input name="fullName" required maxLength={255} autoComplete="name" value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} className={inputClassName} />
									</label>
									<label className="block text-sm font-medium text-charcoal">
										Adresse e-mail <span className="text-crimson">*</span>
										<input name="email" type="email" required autoComplete="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} className={inputClassName} />
									</label>
									<label className="block text-sm font-medium text-charcoal">
										Téléphone
										<input name="phone" type="tel" maxLength={30} autoComplete="tel" placeholder="+237 6XX XXX XXX" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} className={inputClassName} />
									</label>
									<label className="block text-sm font-medium text-charcoal">
										Pays
										<input name="country" maxLength={100} autoComplete="country-name" placeholder="Cameroun" value={profile.country} onChange={(event) => setProfile({ ...profile, country: event.target.value })} className={inputClassName} />
									</label>
									<label className="block text-sm font-medium text-charcoal">
										Ville
										<input name="city" maxLength={150} autoComplete="address-level2" placeholder="Douala" value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} className={inputClassName} />
									</label>
									<label className="block text-sm font-medium text-charcoal">
										Ma chapelle
										<select name="chapelSlug" value={profile.chapelSlug ?? ""} onChange={(event) => {
											const chapel = chapels.find((item) => item.slug === event.target.value);
											setProfile({ ...profile, chapelSlug: chapel?.slug ?? null, chapelName: chapel?.name ?? null });
										}} className={inputClassName}>
											<option value="">Aucune chapelle associée</option>
											{chapels.map((chapel) => <option key={chapel.slug} value={chapel.slug}>{chapel.name} — {chapel.city}, {chapel.country}</option>)}
										</select>
										{chapels.length === 0 && <span className="mt-1 block text-xs text-slate">La liste des chapelles est temporairement indisponible.</span>}
									</label>
								</div>

								{(saveError || saveSuccess) && <div className="mt-6">{saveError ? <ErrorMessage>{saveError}</ErrorMessage> : <SuccessMessage>{saveSuccess!}</SuccessMessage>}</div>}

								<div className="mt-7 flex flex-col-reverse gap-3 border-t border-royal-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
									<p className="text-xs text-slate">Les rôles et le statut spirituel sont gérés par l’administration CLG.</p>
									<button type="submit" disabled={isSaving} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-royal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-royal-700 disabled:cursor-wait disabled:opacity-60">
										{isSaving ? "Enregistrement…" : "Enregistrer le profil"}
									</button>
								</div>
							</form>
						</section>

						<section className="rounded-2xl border border-royal-100 bg-white shadow-sm">
							<div className="border-b border-royal-100 px-5 py-5 sm:px-7">
								<h2 className="font-display text-xl font-semibold text-royal">Sécurité du compte</h2>
								<p className="mt-1 text-sm text-slate">Choisissez un mot de passe fort et ne le partagez avec personne.</p>
							</div>
							<form onSubmit={changePassword} className="space-y-5 p-5 sm:p-7">
								<label className="block text-sm font-medium text-charcoal">
									Mot de passe actuel <span className="text-crimson">*</span>
									<input name="currentPassword" type="password" required autoComplete="current-password" className={inputClassName} />
								</label>
								<div className="grid gap-5 sm:grid-cols-2">
									<label className="block text-sm font-medium text-charcoal">
										Nouveau mot de passe <span className="text-crimson">*</span>
										<input name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={inputClassName} />
									</label>
									<label className="block text-sm font-medium text-charcoal">
										Confirmer le nouveau mot de passe <span className="text-crimson">*</span>
										<input name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className={inputClassName} />
									</label>
								</div>
								{(passwordError || passwordSuccess) && <div>{passwordError ? <ErrorMessage>{passwordError}</ErrorMessage> : <SuccessMessage>{passwordSuccess!}</SuccessMessage>}</div>}
								<div className="flex justify-end border-t border-royal-100 pt-5">
									<button type="submit" disabled={isChangingPassword} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-royal-200 bg-white px-5 py-3 text-sm font-semibold text-royal-700 transition hover:bg-royal-50 disabled:cursor-wait disabled:opacity-60">
										{isChangingPassword ? "Modification…" : "Modifier le mot de passe"}
									</button>
								</div>
							</form>
						</section>
					</div>

					<aside className="space-y-5 lg:sticky lg:top-24">
						<section className="rounded-2xl border border-royal-100 bg-white p-5 shadow-sm sm:p-6">
							<div className="flex items-center gap-4">
								<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-royal-100 bg-cover bg-center text-lg font-bold text-royal" style={visiblePhoto ? { backgroundImage: `url("${visiblePhoto}")` } : undefined}>
									{!visiblePhoto && initials(memberName)}
								</div>
								<div className="min-w-0">
									<p className="truncate font-semibold text-royal-900">{memberName}</p>
									<p className="truncate text-sm text-slate">{profile.email}</p>
								</div>
							</div>
							<div className="mt-5 space-y-3 border-t border-royal-100 pt-5 text-sm">
								<div className="flex items-center justify-between gap-3">
									<span className="text-slate">Statut spirituel</span>
									<span className="text-right font-medium text-charcoal">{soulStatusLabels[profile.soulStatus ?? ""] ?? "Membre CLG"}</span>
								</div>
								<div className="flex items-center justify-between gap-3">
									<span className="text-slate">Chapelle</span>
									<span className="text-right font-medium text-charcoal">{profile.chapelName ?? "Non renseignée"}</span>
								</div>
								<div className="flex items-center justify-between gap-3">
									<span className="text-slate">Membre depuis</span>
									<span className="text-right font-medium text-charcoal">{new Date(profile.dateJoined).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}</span>
								</div>
							</div>
						</section>

						<section className="rounded-2xl border border-gold-100 bg-gold-100/40 p-5">
							<p className="text-sm font-semibold text-royal-900">Votre compte est protégé</p>
							<p className="mt-2 text-sm leading-6 text-slate">Ne partagez jamais votre mot de passe. L’équipe CLG ne vous le demandera pas par e-mail ou téléphone.</p>
						</section>
					</aside>
				</div>
			</div>
		</main>
	);
}
