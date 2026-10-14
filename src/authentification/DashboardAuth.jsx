import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  DONNÉES "PLACEHOLDER" — à remplacer plus tard par les variables    */
/*  PHP/Laravel venant de la base de données (props ou fetch API).     */
/* ------------------------------------------------------------------ */

// Remplacera {{$utilisateur->email}}
const utilisateur = {
  email: "recruteur.demo@invest-emploi.cm",
};

// Remplacera les infos du poste ({{$info->...}}, nombre de vues, etc.)
const myField = {
  titre: "Pasteur",
  nombreInscrit: 2,
};

// Remplacera la boucle @foreach ($result as $info) ... @endforeach
const candidats = [
  {
    id: 1,
    nom: "Cheanze",
    prenom: "raloss",
   
    villeChapelle: "Bafoussam",
    quartierChapelle: "Maeture",
    sexe: "M",
    age: 19,
    region: "Ouest",
    pays: "Cameroun",
    dateTem: "2005-10-24",
    numero: "683902407",
    statut: "croyant",
  },
  {
    id: 2,
    nom: "Jean",
    prenom: "Alan",
    titreTem: "Restauration du mariage",
    temoignage:
      "jfjfdfdhjfdhjfhfhjfdhjfdjhfhhfhfjjfhhdfhfdhjdhjdfhfdhjfhdj",
    villeChapelle: "Garoua",
    quartierChapelle: "Maeture",
    sexe: "F",
    age: 23,
    region: "Sud",
    pays: "Cameroun",
    dateTem: "2006-11-10",
    numero: "622538805",
    statut: "rectrodradant",
  },
];

// Colonnes du tableau — ajoute une entrée ici pour chaque nouvelle
// information à afficher (ex: { key: "telephone", label: "Téléphone" })
const colonnes = [
  { key: "operation", label: "Opération" },
  { key: "id", label: "Numero" },
  { key: "nom", label: "Nom" },
  { key: "prenom", label: "Prénom" },
  { key: "age", label: "Âge" },
  { key: "sexe", label: "Sexe" },
  { key: "region", label: "Région" },
 
  { key: "villeChapelle", label: "Ville Chapelle" },
  { key: "quartierChapelle", label: "Quartier Chapelle" },
  { key: "numero", label: "Numéro" },
  { key: "statut", label: "Statut" },
  { key: "dateTem", label: "Date Naissance" },
];

// Options possibles pour la colonne Statut
const STATUT_OPTIONS = ["croyant", "retrogradant"];

/* ------------------------------------------------------------------ */
/*  Sous-composants                                                    */
/* ------------------------------------------------------------------ */

function DashboardHeader({ utilisateur, myField }) {
  return (
    <div className="mb-6">
      <h2 className="relative overflow-hidden text-2xl font-bold text-[#1368be] mb-5">
        Tableau de bord d'authentification{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #0d47a1 40%, #ff9800 100%)",
          }}
        >
          CLG
        </span>
        
        <span className="pointer-events-none absolute inset-0">
          <span className="absolute top-0 -left-full h-full w-1/2 -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shineGlow_3s_ease-in-out_infinite]" />
        </span>
      </h2>

      <div className="flex gap-[30px] mb-3">
       <div className="flex gap-4">
         <p className="text-[15px] m-0">
          <strong>Administrateur :</strong>{" "}
          <span className="font-semibold text-[#0d47a1]">{myField.titre}</span>
        </p>
        <p className="text-[15px] m-0">
          <strong>Nombre de personne :</strong>{" "}
          <span className="bg-blue-50 text-[#0d47a1] font-semibold rounded-md px-2 py-0.5 text-[13px]">
            {myField.nombreInscrit}
          </span>
        </p>
        <div className="ml-8">
          <label htmlFor="" className="font-semibold text-slate-600 mb-1">Pays</label>
          <select name="" id="" className="border border-slate-300 rounded-md px-2 py-1 text-sm w-full">
            <option value="cameroun">cameroun</option>
            <option value="coteDivoire">cote d'ivoire</option>
            <option value="france">france</option>
          </select>
        </div>
       </div>
      </div>

      {utilisateur && <p className="m-0 mb-2">Bonjour {utilisateur.email}</p>}

      <p className="text-sm text-slate-500 italic mt-0 mb-0">
        Quelques infos sur les témoignages. 
      </p>
    </div>
  );
}

// Boutons texte (sans icône) affichés dans la cellule "Opération" de
// chaque ligne. À brancher plus tard sur les routes Laravel valider/supprimer.
function OperationButtons({ info,onOpenModificate, onDelete }) {

  

  const handleSupprimer = () => {
    console.log("Supprimer ", info.id);
  };

  return (
    <div className="op-buttons">
      <button type="button" onClick={()=> onOpenModificate(info)} className="op-btn op-btn-valider">
        Modifier
      </button>
      <button type="button" onClick={()=> onDelete(info)} className="op-btn op-btn-supprimer">
        Supprimer
      </button>
    </div>
  );
}
 const toDisplayDate = (d) => {
    if(!d) return ""
    const [a,m,j] = d.split("-")
    return `${j}/${m}/${a}` ;
  }
function Modificate({ info, onClose,onSave }) {
  const [form,setForm] = useState(null);
  useEffect(()=> {
    if(info) setForm({...info})
  },[info])
 
  if (!info || !form) return null;

  const handleChange = (e) => {
    const {name, value} = e.target
    setForm({...form,[name]:value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form, age:Number(form.age)
    })
  }

   const inputClass = "border border-slate-300 rounded-md px-2 py-1 text-sm w-full";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1";

  return (
      <div
      className="fixed inset-0 bg-[#121633]/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative"
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
          Modifier : {info.nom} {info.prenom}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="nom" className={labelClass}>Nom</label>
            <input id="nom" name="nom" type="text" value={form.nom} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="prenom" className={labelClass}>Prénom</label>
            <input id="prenom" name="prenom" type="text" value={form.prenom} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="age" className={labelClass}>Âge</label>
            <input id="age" name="age" type="number" value={form.age} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <span className={labelClass}>Sexe</span>
            <label className="mr-3 text-sm">
              <input type="radio" name="sexe" value="M" checked={form.sexe === "M"} onChange={handleChange} /> M
            </label>
            <label className="text-sm">
              <input type="radio" name="sexe" value="F" checked={form.sexe === "F"} onChange={handleChange} /> F
            </label>
          </div>

          <div>
            <label htmlFor="region" className={labelClass}>Région</label>
            <input id="region" name="region" type="text" value={form.region} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="villeChapelle" className={labelClass}>Ville chapelle</label>
            <input id="villeChapelle" name="villeChapelle" type="text" value={form.villeChapelle} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="quartierChapelle" className={labelClass}>Quartier chapelle</label>
            <input id="quartierChapelle" name="quartierChapelle" type="text" value={form.quartierChapelle} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="numero" className={labelClass}>Numéro</label>
            <input id="numero" name="numero" type="tel" value={form.numero} onChange={handleChange} className={inputClass} />
          </div>

          <div className="col-span-2">
            <label htmlFor="dateTem" className={labelClass}>Date naissance</label>
            <input id="dateTem" name="dateTem" type="date" value={form.dateTem} onChange={handleChange} className={inputClass} />
          </div>

          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-slate-300">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 text-sm rounded-md bg-[#0d47a1] text-white font-semibold">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



// Affiche la valeur d'une cellule selon la colonne. "temoignage" ouvre
// désormais un menu contextuel (modale) au clic via onOpenTemoignage.
function CellValue({ colKey, info, onOpenModificate, onDelete }) {
  if (colKey === "operation") {
    return <OperationButtons info={info} onOpenModificate={onOpenModificate} onDelete={onDelete} />;
  }
  if (colKey === "id") {
    return <span className="font-bold text-slate-500">{info.id}</span>;
  }
  if (colKey === "nom") {
    return <span className="font-semibold text-slate-900">{info.nom}</span>;
  }
  if (colKey === "titreTem") {
    return (
      <span className="bg-slate-100 text-slate-600 rounded-md px-2.5 py-1 text-xs font-semibold">
        {info.titreTem}
      </span>
    );
  }

  if (colKey === "numero") {
    return (
      
      <a  href={`tel:${info.numero}`}
        className="text-[#0d47a1] font-medium hover:underline"
      >
        {info.numero}
      </a>
    );
  }
  if (colKey === "statut") {
    // Simple <select> d'affichage, aucune logique métier branchée pour l'instant.
    return (
      <select
        defaultValue={info.statut}
        className="text-xs font-semibold rounded-md border border-slate-300 px-2 py-1 text-slate-700 bg-white"
      >
        {STATUT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
  return <span className="text-slate-700">{info[colKey]}</span>;
}

function CandidatesTable({ candidats, colonnes, onOpenModificate, onDelete }) {
  return (
    // 1) "overflow-x-auto" active le défilement horizontal DÈS QUE le
    //    contenu dépasse la largeur du conteneur.
    // 2) "min-w-[1500px]" sur la <table> empêche les colonnes de se tasser :
    //    tant que le conteneur est plus étroit que cette valeur, une barre
    //    de défilement apparaît au lieu de compresser les colonnes.
    //    -> augmente cette valeur au fur et à mesure que tu ajoutes des
    //       colonnes.
    <div className="w-full overflow-x-auto mb-8 rounded-lg border border-slate-200">
      <table className="min-w-[1500px] w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {colonnes.map((col) => (
              <th
                key={col.key}
                className={`bg-slate-50 text-slate-900 font-bold py-4 px-4 uppercase text-[11px] tracking-wider border-b-2 border-slate-200 whitespace-nowrap ${
                  col.key === "operation" ? "w-48 max-[900px]:w-20 max-[900px]:px-2" : ""
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {candidats.length === 0 ? (
            <tr>
              <td colSpan={colonnes.length} className="py-4 px-4 text-slate-500">
                Aucun enregistrement
              </td>
            </tr>
          ) : (
            candidats.map((info) => (
              <tr key={info.id} className="hover:bg-slate-50">
                {colonnes.map((col) => (
                  <td
                    key={col.key}
                    className={`py-2 px-4 border-b border-slate-200 whitespace-nowrap ${
                      col.key === "operation" ? "w-48 max-[900px]:w-20 max-[900px]:px-2" : ""
                    }`}
                  >
                <CellValue colKey={col.key} info={info} onOpenModificate={onOpenModificate} onDelete={onDelete} />
                   
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SaveButton({ onClick }) {
  return (
    <div className="flex justify-start">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center bg-[#0d47a1] hover:bg-[#0b3a85] text-white font-semibold text-sm rounded-lg px-6 py-3 shadow-[0_4px_6px_rgba(13,71,161,0.15)] hover:shadow-[0_6px_12px_rgba(13,71,161,0.25)] hover:-translate-y-px active:translate-y-px transition-all"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        Inscrire
      </button>
    </div>
  );
}

// Menu contextuel (modale) affichant le témoignage complet.


/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function DashboardAuth() {
 
  const [listeCandidats, setListeCandidats] = useState(candidats);
  const [ModificateOuvert, setModificateOuvert] = useState(null);

  const handleAdd = () => {
    // À brancher plus tard sur la route Laravel de suppression
    console.log("Inscrire");
  };
  const handleSave = (updated) => {
    setListeCandidats(
      listeCandidats.map((c) => (c.id === updated.id? updated : c))
    )
  }

    const handleDelete = (info) => {
    const ok = window.confirm(`Supprimer ${info.nom} ${info.prenom}`)
    if(!ok) return;

    setListeCandidats(listeCandidats.filter((c) => c.id !==info.id))
    setModificateOuvert(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <style>{`
        @keyframes shineGlow {
          0% { left: -150%; }
          50% { left: 150%; }
          100% { left: 150%; }
        }

        /* Boutons Opération : côte à côte au-delà de 900px, empilés en
           dessous. Implémenté en CSS pur (media query classique) plutôt
           qu'avec les variantes Tailwind "max-[900px]:" pour que ça
           fonctionne quelle que soit la version de Tailwind installée. */
        .op-buttons {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .op-btn {
          font-size: 12px;
          font-weight: 600;
          border-radius: 6px;
          padding: 4px 12px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .op-btn-valider {
          color: #0d47a1;
          border-color: #0d47a1;
        }
        .op-btn-valider:hover {
          background-color: #0d47a1;
          color: #fff;
        }
        .op-btn-supprimer {
          color: #ef4444;
          border-color: #ef4444;
        }
        .op-btn-supprimer:hover {
          background-color: #ef4444;
          color: #fff;
        }
        @media (max-width: 900px) {
          .op-buttons {
            flex-direction: column;
            align-items: stretch;
            gap: 4px;
          }
          .op-btn {
            padding: 4px 8px;
            font-size: 10px;
          }
        }
      `}</style>

      <main className="max-w-6xl mx-auto my-[90px] bg-white p-10 rounded-[17px] border border-slate-200 shadow-[0_15px_40px_rgba(15,23,42,0.04)]">
        <DashboardHeader utilisateur={utilisateur} myField={{...myField,nombreInscrit:listeCandidats.length}} />
        
          <CandidatesTable
    candidats={listeCandidats}
    colonnes={colonnes}
    onOpenModificate={setModificateOuvert}
    onDelete={handleDelete}
  />

        <SaveButton onClick={handleAdd} />
      </main>

      <Modificate info={ModificateOuvert} onClose={() => setModificateOuvert(null)} onSave = {handleSave} />
    </div>
  );
}