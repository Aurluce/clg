import { useState } from "react";

const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const inputClass =
  "w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 " +
  "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

const selectClass =
  inputClass + " appearance-none pr-8 bg-no-repeat cursor-pointer";

// Petite flèche de sélecteur (chevron) en SVG inline
function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

function Select({ children, ...props }) {
  return (
    <div className="relative">
      <select className={selectClass} {...props}>
        {children}
      </select>
      <Chevron />
    </div>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div>
      {children}
      <label htmlFor={htmlFor} className="mt-2 block text-xs text-slate-500">
        {label}
      </label>
    </div>
  );
}

export default function FormTem() {
  const [form, setForm] = useState({
    prenom: "",
    deuxiemePrenom: "",
    nom: "",
    sexe: "Femme",
    jour: "",
    mois: "",
    annee: "",
    adresse: "",
    ville: "",
    quartier: "",
    numero: "",
    titreTem: "",
    
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const annees = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-slate-200/70 px-4 py-4 font-sans">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-md bg-white shadow-md">
        {/* En-tête */}
        <header className="border-b border-slate-200 px-8 pb-6 pt-10 sm:px-14">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            Formulaire d'enregistrement des temoignages
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Remplissez soigneusement ce formulaire
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10 px-8 pb-12 pt-10 sm:px-14">
          {/* Nom complet */}
          <fieldset>
            <legend className="mb-3 text-base text-slate-700">Nom complet</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Prénom" htmlFor="prenom">
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  autoComplete="given-name"
                  value={form.prenom}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
              <Field label="Deuxième prénom" htmlFor="deuxiemePrenom">
                <input
                  id="deuxiemePrenom"
                  name="deuxiemePrenom"
                  type="text"
                  autoComplete="additional-name"
                  value={form.deuxiemePrenom}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
              <Field label="Nom de famille" htmlFor="nom">
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  autoComplete="family-name"
                  value={form.nom}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>
          </fieldset>

          {/* Sexe + Date de naissance */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <label htmlFor="sexe" className="mb-3 block text-base text-slate-700">
                Sexe
              </label>
              <Select id="sexe" name="sexe" value={form.sexe} onChange={handleChange}>
                <option>Masculin</option>
                <option>Feminin</option>
               
              </Select>
            </div>

            <fieldset>
              <legend className="mb-3 text-base text-slate-700">Date de naissance</legend>
              <div className="grid grid-cols-3 gap-3">
                <Select
                  name="jour"
                  aria-label="Jour"
                  value={form.jour}
                  onChange={handleChange}
                >
                  <option value="">Jour</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Select>
                <Select
                  name="mois"
                  aria-label="Mois"
                  value={form.mois}
                  onChange={handleChange}
                >
                  <option value="">Mois</option>
                  {MOIS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </Select>
                <Select
                  name="annee"
                  aria-label="Année"
                  value={form.annee}
                  onChange={handleChange}
                >
                  <option value="">Année</option>
                  {annees.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </Select>
              </div>
            </fieldset>
          </div>

          {/* Adresse */}
          <fieldset>
            <legend className="mb-3 text-base text-slate-700">Adresse</legend>
            <div className="space-y-6">
              <Field label="Adresse" htmlFor="adresse">
                <input
                  id="adresse"
                  name="adresse"
                  type="text"
                  autoComplete="street-address"
                  value={form.adresse}
                  onChange={handleChange}
                  className={inputClass}
                />

              </Field>
               
               <Field label="Numero de telephone">
                 <input
                  id="numero"
                  name="numero"
                  type="number"
                  autoComplete="street-address"
                  value={form.numero}
                  onChange={handleChange}
                  className={inputClass}
                />
               </Field>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Ville" htmlFor="ville">
                  <input
                    id="ville"
                    name="ville"
                    type="text"
                    autoComplete="address-level2"
                    value={form.ville}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Quartier de votre chapelle">
                  <input
                    id="departement"
                    name="quatier"
                    type="text"
                    autoComplete="address-level1"
                    value={form.quartier}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                 <Field label="Titre du temoignage (maximum 60 caracteres)">
                 <input type="text" className={inputClass} name="orateur" value={form.titreTem}
                    onChange={handleChange} maxLength={60}
                    />
                </Field>
                <Field label="Temoignage">
                 <textarea onChange={handleChange} value={form.titreTem}
                  className="h-48 w-full rounded-md border border-slate-300 p-3" ></textarea>
                </Field>
                <Field label="Ou encore, cliquer ici pour enregistrer votre temoignage en audio, video ou texte">
                  <input type="file" className={inputClass} />
                </Field>
              </div>

             
            </div>
          </fieldset>

          <button
            type="submit"
            className="h-11 rounded-md bg-indigo-600 px-6 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
