
"use client";

import Link from "next/link";
import { useState } from "react";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { chapels } from "@/lib/mock/content";

const churchStatuses = [
  {
    value: "SIMPLE_FIDELE",
    label: "Simple fidèle",
  },
  {
    value: "ASPIRANT",
    label: "Aspirant",
  },
  {
    value: "INSTRUMENTISTE",
    label: "Instrumentiste",
  },
   {
    value: "CHORISTE",
    label: "Choriste",
  },
   {
    value: "MONITEUR/TRICE",
    label: "Moniteur/trice",
  },
   {
    value: "EVANGELISTE",
    label: "Évangeliste",
  },
  {
    value: "DIACRE",
    label: "Diacre",
  },
  {
    value: "ENUQUE",
    label: "Énuque",
  },
  {
    value: "PASTEUR",
    label: "Pasteur",
  },
];

const countries = [
  "Cameroun",
  "France",
  "Belgique",
  "Canada",
  "Côte d'Ivoire",
  "Gabon",
  "Guinée",
  "République démocratique du Congo",
  "République du Congo",
  "Sénégal",
  "Togo",
  "Bénin",
  "Nigeria",
  "Ghana",
  "États-Unis",
  "Royaume-Uni",
  "Autre",
];

export default function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  const passwordStrong =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  const canSubmit =
    passwordsMatch &&
    passwordStrong &&
    acceptedTerms;

  return (
    <>
      <PageHero
        eyebrow="Rejoindre la CLG"
        title="Créer votre compte"
      />

      <Section>
        <div className="mx-auto max-w-5xl">
          {/* =========================================================
              INTRODUCTION
          ========================================================= */}
          <div className="mb-10 text-center">
            <p className="mx-auto max-w-2xl font-body text-sm leading-6 text-slate sm:text-base">
              Créez votre compte pour rejoindre l'espace numérique de la
              Church of the Living God et être rattaché à votre chapelle.
            </p>
          </div>

          {/* =========================================================
              FORM CARD
          ========================================================= */}
          <div className="overflow-hidden rounded-2xl border border-royal-100 bg-paper shadow-[0_20px_60px_rgba(12,44,82,0.08)]">

            {/* Header */}
            <div className="border-b border-royal-100 bg-royal-50 px-5 py-6 sm:px-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-royal text-paper">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    />
                    <circle cx="9" cy="7" r="4" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 8v6M22 11h-6"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="font-display text-xl font-semibold text-royal">
                    Informations personnelles
                  </h2>

                  <p className="mt-1 font-body text-sm text-slate">
                    Veuillez renseigner vos informations pour créer votre
                    compte.
                  </p>
                </div>
              </div>
            </div>

            <form
              className="p-5 sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();

                if (!canSubmit) return;

                alert(
                  "Formulaire à connecter à l'API Django (POST /api/auth/register)."
                );
              }}
            >
              {/* =======================================================
                  PERSONAL INFORMATION
              ======================================================= */}
              <div>
                <div className="mb-5">
                  <h3 className="font-display text-lg font-semibold text-royal">
                    Identité
                  </h3>

                  <p className="mt-1 text-sm text-slate">
                    Ces informations permettront d'identifier votre compte
                    dans la communauté CLG.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Full name */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Nom complet
                      <span className="ml-1 text-crimson">*</span>
                    </label>

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Ex. Jean Dupont"
                      className="mt-2 w-full rounded-lg border border-royal-100 bg-paper px-4 py-3 font-body text-sm text-charcoal outline-none transition focus:border-royal focus:ring-2 focus:ring-royal-100"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Adresse e-mail
                      <span className="ml-1 text-crimson">*</span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      className="mt-2 w-full rounded-lg border border-royal-100 bg-paper px-4 py-3 font-body text-sm text-charcoal outline-none transition focus:border-royal focus:ring-2 focus:ring-royal-100"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Téléphone
                      <span className="ml-1 text-crimson">*</span>
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+237 6XX XX XX XX"
                      className="mt-2 w-full rounded-lg border border-royal-100 bg-paper px-4 py-3 font-body text-sm text-charcoal outline-none transition focus:border-royal focus:ring-2 focus:ring-royal-100"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label
                      htmlFor="country"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Pays
                      <span className="ml-1 text-crimson">*</span>
                    </label>

                    <select
                      id="country"
                      name="country"
                      required
                      value={selectedCountry}
                      onChange={(e) =>
                        setSelectedCountry(e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-royal-100 bg-paper px-4 py-3 font-body text-sm text-charcoal outline-none transition focus:border-royal focus:ring-2 focus:ring-royal-100"
                    >
                      <option value="">Sélectionner votre pays</option>

                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label
                      htmlFor="city"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Ville
                      <span className="ml-1 text-crimson">*</span>
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      autoComplete="address-level2"
                      placeholder="Ex. Bafoussam"
                      className="mt-2 w-full rounded-lg border border-royal-100 bg-paper px-4 py-3 font-body text-sm text-charcoal outline-none transition focus:border-royal focus:ring-2 focus:ring-royal-100"
                    />
                  </div>
                </div>
              </div>

              {/* =======================================================
                  CHURCH INFORMATION
              ======================================================= */}
              <div className="mt-10 border-t border-royal-100 pt-8">
                <div className="mb-5">
                  <h3 className="font-display text-lg font-semibold text-royal">
                    Informations au sein de la CLG
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate">
                    Indiquez votre situation actuelle au sein de l'Église.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Church status */}
                  <div>
                    <label
                      htmlFor="churchStatus"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Fonction / statut dans l'Église
                      <span className="ml-1 text-crimson">*</span>
                    </label>

                    <select
                      id="churchStatus"
                      name="churchStatus"
                      required
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value)
                      }
                      className="mt-2 w-full rounded-lg border border-royal-100 bg-paper px-4 py-3 font-body text-sm text-charcoal outline-none transition focus:border-royal focus:ring-2 focus:ring-royal-100"
                    >
                      <option value="">
                        Sélectionner votre statut
                      </option>

                      {churchStatuses.map((status) => (
                        <option
                          key={status.value}
                          value={status.value}
                        >
                          {status.label}
                        </option>
                      ))}
                    </select>

                    <p className="mt-2 text-xs leading-5 text-slate">
                      Le statut déclaré pourra être vérifié par
                      l'administration de la CLG.
                    </p>
                  </div>

                  {/* Chapel */}
                  <div>
                    <label
                      htmlFor="chapel"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Chapelle
                    </label>

                    <select
                      id="chapel"
                      name="chapel"
                      className="mt-2 w-full rounded-lg border border-royal-100 bg-paper px-4 py-3 font-body text-sm text-charcoal outline-none transition focus:border-royal focus:ring-2 focus:ring-royal-100"
                    >
                      <option value="">
                        Sélectionner une chapelle
                      </option>

                      {chapels.map((chapel) => (
                        <option
                          key={chapel.slug}
                          value={chapel.slug}
                        >
                          {chapel.name} — {chapel.city}
                        </option>
                      ))}
                    </select>

                    <p className="mt-2 text-xs leading-5 text-slate">
                      Le rattachement à une chapelle pourra être validé
                      par le pasteur.
                    </p>
                  </div>
                </div>

                {/* Pastor notice */}
                {selectedStatus === "PASTEUR" && (
                  <div className="mt-5 rounded-lg border border-gold-100 bg-gold-100/40 p-4">
                    <div className="flex gap-3">
                      <span
                        className="mt-0.5 text-gold-700"
                        aria-hidden="true"
                      >
                        ⚠
                      </span>

                      <p className="text-xs leading-5 text-charcoal">
                        Vous avez sélectionné le statut{" "}
                        <strong>Pasteur</strong>. Ce statut devra être
                        confirmé par l'administration avant l'attribution
                        des privilèges d'administrateur.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* =======================================================
                  SECURITY
              ======================================================= */}
              <div className="mt-10 border-t border-royal-100 pt-8">
                <div className="mb-5">
                  <h3 className="font-display text-lg font-semibold text-royal">
                    Sécurité du compte
                  </h3>

                  <p className="mt-1 text-sm text-slate">
                    Choisissez un mot de passe sécurisé pour protéger votre
                    compte.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Mot de passe
                      <span className="ml-1 text-crimson">*</span>
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="Minimum 8 caractères"
                        className="w-full rounded-lg border border-royal-100 bg-paper px-4 py-3 pr-20 font-body text-sm text-charcoal outline-none transition focus:border-royal focus:ring-2 focus:ring-royal-100"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((value) => !value)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-royal hover:text-crimson"
                      >
                        {showPassword ? "Masquer" : "Afficher"}
                      </button>
                    </div>

                    <div className="mt-2 space-y-1 text-xs">
                      <p
                        className={
                          password.length >= 8
                            ? "text-green-700"
                            : "text-slate"
                        }
                      >
                        {password.length >= 8 ? "✓" : "•"} 8 caractères
                        minimum
                      </p>

                      <p
                        className={
                          /[A-Z]/.test(password) &&
                          /[a-z]/.test(password) &&
                          /\d/.test(password)
                            ? "text-green-700"
                            : "text-slate"
                        }
                      >
                        {/[A-Z]/.test(password) &&
                        /[a-z]/.test(password) &&
                        /\d/.test(password)
                          ? "✓"
                          : "•"}{" "}
                        Une majuscule, une minuscule et un chiffre
                      </p>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="font-body text-sm font-medium text-charcoal"
                    >
                      Confirmer le mot de passe
                      <span className="ml-1 text-crimson">*</span>
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="Répétez votre mot de passe"
                        className={[
                          "w-full rounded-lg border bg-paper px-4 py-3 pr-20 font-body text-sm text-charcoal outline-none transition focus:ring-2",
                          !passwordsMatch
                            ? "border-crimson focus:border-crimson focus:ring-crimson-100"
                            : "border-royal-100 focus:border-royal focus:ring-royal-100",
                        ].join(" ")}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) => !value
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-royal hover:text-crimson"
                      >
                        {showConfirmPassword
                          ? "Masquer"
                          : "Afficher"}
                      </button>
                    </div>

                    {!passwordsMatch && (
                      <p className="mt-2 text-xs font-medium text-crimson">
                        Les mots de passe ne correspondent pas.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* =======================================================
                  TERMS
              ======================================================= */}
              <div className="mt-8 rounded-lg bg-paper-dark p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) =>
                      setAcceptedTerms(e.target.checked)
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-[#1B5FAE]"
                  />

                  <span className="text-xs leading-5 text-slate">
                    J'accepte les conditions d'utilisation et la
                    politique de confidentialité de la plateforme CLG.
                    <span className="ml-1 text-crimson">*</span>
                  </span>
                </label>
              </div>

              {/* =======================================================
                  DEFAULT ROLE
              ======================================================= */}
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-royal-100 bg-royal-50 p-4">
                <span
                  className="mt-0.5 text-royal"
                  aria-hidden="true"
                >
                  ℹ
                </span>

                <p className="text-xs leading-5 text-slate">
                  Après l'inscription, votre compte sera créé avec les
                  permissions correspondant à votre situation. Les
                  privilèges administratifs ne sont pas attribués
                  automatiquement lors de l'inscription.
                </p>
              </div>

              {/* =======================================================
                  SUBMIT
              ======================================================= */}
              <div className="mt-8">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!canSubmit}
                  className="w-full py-3.5 text-sm font-semibold sm:w-auto sm:min-w-56"
                >
                  Créer mon compte
                </Button>
              </div>

              {/* Login */}
              <div className="mt-6 border-t border-royal-100 pt-6 text-center">
                <p className="font-body text-sm text-slate">
                  Vous avez déjà un compte ?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-royal no-underline transition-colors hover:text-crimson"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
