import React from "react";

/* ------------------------------------------------------------------ */
/*  DONNÉES "PLACEHOLDER" — à remplacer plus tard par les variables    */
/*  PHP/Laravel venant de la base de données (props ou fetch API).     */
/* ------------------------------------------------------------------ */

// Remplacera {{$utilisateur->email}}
const utilisateur = {
  email: "recruteur.demo@invest-emploi.cm",
};

// Remplacera les infos du poste ({{$info->...}}, nombre de vues, etc.)
const offreEmploi = {
  titre: "Pasteur",
  nombreInscrit: 24,
};

// Remplacera la boucle @foreach ($result as $info) ... @endforeach
const candidats = [
  {
    id: 1,
    nom: "Cheanze",
    prenom: "raloss",
     titreTem: "Guerison du cancer",
    temoignage: "ghgvffhvhgghhghghgghhgghgghggvvvvcvcvcvcvcccvcvccg",
    villeChapelle: "Bafoussam",
    QuartierChapelle: "Maeture",
    sexe: "M",
    age:19,
    region: "Ouest",
    pays: "Cameroun",
   
    dateTem: "24/10/2026",
    numero:"683902407",
  },
  {
    id:2 ,
    nom: "Jean",
    prenom: "Alan",
    titreTem: "Restauration du mariage",
    temoignage: "jfjfdfdhjfdhjfhfhjfdhjfdjhfhhfhfjjfhhdfhfdhjdhjdfhfdhjfhdj",
    villeChapelle:"Garoua" ,
    QuartierChapelle: "Maeture",
    sexe: "F",
    age:23,
    region: "Sud",
    
    dateTem: "10/11/2026",
    numero:"622538805",
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
  { key: "titreTem", label: "Sujet temoignage" },
  { key: "temoignage", label: "temoignage" },
  { key: "villeChapelle", label: "ville Chapelle" },
  { key: "quartierChapelle", label: "Quartier Chapelle" },
  { key: "numero", label: "numero" },
  { key: "dateTem", label: "date temoignage" },
  
  
];

/* ------------------------------------------------------------------ */
/*  Sous-composants                                                    */
/* ------------------------------------------------------------------ */



function DashboardHeader({ utilisateur, offreEmploi }) {
  return (
    <div className="mb-6">
      <h2 className="relative overflow-hidden text-2xl font-bold text-[#1368be] mb-5">
        Bienvenue sur votre espace{" "}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #0d47a1 40%, #ff9800 100%)",
          }}
        >
          CLG - Dashboard des temoignages
        </span>
        <span className="pointer-events-none absolute inset-0">
          <span className="absolute top-0 -left-full h-full w-1/2 -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shineGlow_3s_ease-in-out_infinite]" />
        </span>
      </h2>

      <div className="flex gap-[30px] mb-3">
        <p className="text-[15px] m-0">
          <strong>Administrateur :</strong>{" "}
          <span className="font-semibold text-[#0d47a1]">{offreEmploi.titre}</span>
        </p>
        <p className="text-[15px] m-0">
          <strong>Nombre de temoignages :</strong>{" "}
          <span className="bg-blue-50 text-[#0d47a1] font-semibold rounded-md px-2 py-0.5 text-[13px]">
            {offreEmploi.nombreInscrit}
          </span>
        </p>
      </div>

      {utilisateur && <p className="m-0 mb-2">Bonjour {utilisateur.email}</p>}

      <p className="text-sm text-slate-500 italic mt-0 mb-0">
        Quelques infos sur les candidats. Les autres informations vous parviendront par mail.
      </p>
    </div>
  );
}

// Boutons texte (sans icône) affichés dans la cellule "Opération" de
// chaque ligne. À brancher plus tard sur les routes Laravel modifier/supprimer.
function OperationButtons({ info }) {
  const handleModifier = () => {
    console.log("Modifier le candidat", info.id);
  };

  const handleSupprimer = () => {
    console.log("Supprimer le candidat", info.id);
  };

  return (
    <div className="flex flex-col items-center gap-2 max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:gap-1">
      <button
        type="button"
        onClick={handleModifier}
        className="text-xs font-semibold text-[#0d47a1] border border-[#0d47a1] rounded-md px-3 py-1.5 hover:bg-[#0d47a1] hover:text-white transition-colors max-[900px]:px-2 max-[900px]:py-1 max-[900px]:text-[10px]"
      >
        Modifier
      </button>
      <button
        type="button"
        onClick={handleSupprimer}
        className="text-xs font-semibold text-red-500 border border-red-500 rounded-md px-3 py-1.5 hover:bg-red-500 hover:text-white transition-colors max-[900px]:px-2 max-[900px]:py-1 max-[900px]:text-[10px]"
      >
        Supprimer
      </button>
    </div>
  );
}

// Affiche la valeur d'une cellule selon la colonne (id, email et diplôme
// gardent leur style particulier, le reste s'affiche en texte simple).
function CellValue({ colKey, info }) {
  if (colKey === "operation") {
    return <OperationButtons info={info} />;
  }
  if (colKey === "id") {
    return <span className="font-bold text-slate-500">{info.id}</span>;
  }
  if (colKey === "nom") {
    return <span className="font-semibold text-slate-900">{info.nom}</span>;
  }
  if (colKey === "diplome") {
    return (
      <span className="bg-slate-100 text-slate-600 rounded-md px-2.5 py-1 text-xs font-semibold">
        {info.diplome}
      </span>
    );
  }
  
  if (colKey === "email") {
    return (
      <a
        href={`mailto:${info.email}`}
        className="text-[#0d47a1] font-medium hover:underline"
      >
        {info.email}
      </a>
    );
  }
  return <span className="text-slate-700">{info[colKey]}</span>;
}

function CandidatesTable({ candidats, colonnes }) {
  return (
    // 1) "overflow-x-auto" active le défilement horizontal DÈS QUE le
    //    contenu dépasse la largeur du conteneur.
    // 2) "min-w-[900px]" sur la <table> empêche les colonnes de se tasser :
    //    tant que le conteneur est plus étroit que 900px, une barre de
    //    défilement apparaît au lieu de compresser les colonnes.
    //    -> augmente cette valeur au fur et à mesure que tu ajoutes des
    //       colonnes (ex: 1100px avec téléphone + ville, etc.)
    <div className="w-full overflow-x-auto mb-8 rounded-lg border border-slate-200">
      <table className="min-w-[900px] w-full border-collapse text-left text-sm">
        <thead>
          <tr>
            {colonnes.map((col) => (
              <th
                key={col.key}
                className={`bg-slate-50 text-slate-900 font-bold py-4 px-4 uppercase text-[11px] tracking-wider border-b-2 border-slate-200 whitespace-nowrap ${
                  col.key === "operation" ? "w-36 max-[900px]:w-20 max-[900px]:px-2" : ""
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
                Aucun contact
              </td>
            </tr>
          ) : (
            candidats.map((info) => (
              <tr key={info.id} className="hover:bg-slate-50">
                {colonnes.map((col) => (
                  <td
                    key={col.key}
                    className={`py-2 px-4 border-b border-slate-200 whitespace-nowrap ${
                      col.key === "operation" ? "w-36 max-[900px]:w-20 max-[900px]:px-2" : ""
                    }`}
                  >
                    <CellValue colKey={col.key} info={info} />
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

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function DashboardTem() {
  const handleAdd = () => {
    // À brancher plus tard sur la route Laravel de suppression
    console.log("Suppression demandée");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <style>{`
        @keyframes shineGlow {
          0% { left: -150%; }
          50% { left: 150%; }
          100% { left: 150%; }
        }
      `}</style>

      

      <main className="max-w-4xl mx-auto my-[90px] bg-white p-10 rounded-[17px] border border-slate-200 shadow-[0_15px_40px_rgba(15,23,42,0.04)]">
        <DashboardHeader utilisateur={utilisateur} offreEmploi={offreEmploi} />
        <CandidatesTable candidats={candidats} colonnes={colonnes} />
        <SaveButton onClick={handleAdd} />
      </main>
    </div>
  );
}
