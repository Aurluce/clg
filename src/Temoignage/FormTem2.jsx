import { useState } from "react";

const inputClass =
  "w-full h-11 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 " +
  "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";



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

 export default function MyTestimony({open, onClose}) {
  const [form, setForm] = useState({ sujetTem: "", temoignage: "", format: "", });
  if(!open){return null}
  

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    setForm({ sujetTem: "", temoignage: "", format: "" }); // vide le formulaire après l'envoi
  };

  return (
    <div
      className="fixed sm:mx-auto inset-0 bg-[#121633]/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-[300px] sm:w-[512px] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl leading-none"
          aria-label="Fermer"
        >
          &times;
        </button>

        <h3 className="text-lg font-bold text-[#0d47a1] mb-4">
          Enregistrez votre témoignage
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Sujet du témoignage" htmlFor="sujetTem">
            <input
              type="text"
              id="sujetTem"
              name="sujetTem"
              autoComplete="off"
              value={form.sujetTem}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <Field label="Votre témoignage" htmlFor="temoignage">
            <textarea
              id="temoignage"
              name="temoignage"
              rows={5}
              value={form.temoignage}
              onChange={handleChange}
              className={inputClass + " h-auto py-2"}
            />
          </Field>

           <Field label="votre temoignage est au format video, audio ou texte?" htmlFor="format">
            <input
              type="file"
              id="format"
              name="format"
              autoComplete="off"
              value={form.format}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>

          <button
            type="submit"
            className="w-full h-11 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}