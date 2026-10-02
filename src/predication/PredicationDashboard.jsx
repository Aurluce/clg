import React, { useState } from "react";

/* ------------------------------------------------------------------ */
/*  DONNÉES "PLACEHOLDER" — à remplacer plus tard par les variables    */
/*  PHP/Laravel venant de la base de données (props ou fetch API).     */
/* ------------------------------------------------------------------ */

// Remplacera {{$utilisateur->email}}
const utilisateur = {
  email: "admin.demo@clg.cm",
};

// Remplacera les infos de l'espace ({{$info->...}}, nombre inscrit, etc.)
const infosEspace = {
  titre: "Administrateur des prédications",
  nombreInscrit: 3,
};

// Remplacera la boucle @foreach ($predications as $p) ... @endforeach
const predications = [
  {
    id: 1,
    nom: "Cheanze",
    prenom: "Raloss",
    adresse: "Rue 12, Bafoussam",
    ville: "Bafoussam",
    quartierChapelle: "Maeture",
    orateur: "Pasteur Jean Tchana",
    themePredication: "La grâce qui restaure",
    date: "24/10/2026",
    statut: "en attente",
    mediaType: "audio",
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    nom: "Jean",
    prenom: "Alan",
    adresse: "Avenue Kennedy",
    ville: "Garoua",
    quartierChapelle: "Maeture",
    orateur: "Pasteur Alain Njoya",
    themePredication: "Marcher par la foi",
    date: "10/11/2026",
    statut: "publier",
    mediaType: "video",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: 3,
    nom: "Mballa",
    prenom: "Sarah",
    adresse: "Quartier Nkolbisson",
    ville: "Yaoundé",
    quartierChapelle: "Bethel",
    orateur: "Pasteur David Mvondo",
    themePredication: "Le renouvellement de l'esprit",
    date: "02/12/2026",
    statut: "publier",
    mediaType: "audio",
    mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

// Colonnes du tableau — ajoute une entrée ici pour chaque nouvelle
// information à afficher (ex: { key: "telephone", label: "Téléphone" })
const colonnes = [
  { key: "operation", label: "Opération" },
  { key: "nom", label: "Nom" },
  { key: "prenom", label: "Prénom" },
  { key: "adresse", label: "Adresse" },
  { key: "ville", label: "Ville" },
  { key: "quartierChapelle", label: "Quartier Chapelle" },
  { key: "orateur", label: "Orateur" },
  { key: "themePredication", label: "Thème prédication" },
  { key: "date", label: "Date" },
  { key: "statut", label: "Statut" },
  { key: "predication", label: "Prédication" },
];

// Options possibles pour la colonne Statut
const STATUT_OPTIONS = ["publier", "en attente"];

/* ------------------------------------------------------------------ */
/*  Sous-composants                                                    */
/* ------------------------------------------------------------------ */

function DashboardHeader({ utilisateur, infosEspace }) {
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
          CLG
        </span>
        <span className="pointer-events-none absolute inset-0">
          <span className="absolute top-0 -left-full h-full w-1/2 -skew-x-[25deg] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shineGlow_3s_ease-in-out_infinite]" />
        </span>
      </h2>

      <div className="flex gap-[30px] mb-3">
        <p className="text-[15px] m-0">
          <strong>{infosEspace.titre}</strong>
        </p>
        <p className="text-[15px] m-0">
          <strong>Nombre de prédications :</strong>{" "}
          <span className="bg-blue-50 text-[#0d47a1] font-semibold rounded-md px-2 py-0.5 text-[13px]">
            {infosEspace.nombreInscrit}
          </span>
        </p>
      </div>

      {utilisateur && <p className="m-0 mb-2">Bonjour {utilisateur.email}</p>}

      <p className="text-sm text-slate-500 italic mt-0 mb-0">
        Liste des prédications enregistrées et de leur statut de publication.
      </p>
    </div>
  );
}

// Boutons texte (sans icône) affichés dans la cellule "Opération" de
// chaque ligne. À brancher plus tard sur les routes Laravel valider/supprimer.
function OperationButtons({ info }) {
  const handleValider = () => {
    console.log("Valider la prédication", info.id);
  };

  const handleSupprimer = () => {
    console.log("Supprimer la prédication", info.id);
  };

  return (
    <div className="op-buttons">
      <button type="button" onClick={handleValider} className="op-btn op-btn-valider">
        Valider
      </button>
      <button type="button" onClick={handleSupprimer} className="op-btn op-btn-supprimer">
        Supprimer
      </button>
    </div>
  );
}

// Icônes inline (évite une dépendance externe type lucide-react)
function IconPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconHeadphones() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  );
}

// Affiche la valeur d'une cellule selon la colonne. "predication" ouvre
// désormais un menu contextuel (modale) au clic via onOpenPredication.
function CellValue({ colKey, info, onOpenPredication }) {
  if (colKey === "operation") {
    return <OperationButtons info={info} />;
  }
  if (colKey === "nom") {
    return <span className="font-semibold text-slate-900">{info.nom}</span>;
  }
  if (colKey === "themePredication") {
    return (
      <span className="bg-slate-100 text-slate-600 rounded-md px-2.5 py-1 text-xs font-semibold">
        {info.themePredication}
      </span>
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
  if (colKey === "predication") {
    // Cliquable : ouvre la modale de lecture audio/vidéo.
    return (
      <span
        title="Cliquer pour écouter / regarder la prédication"
        onClick={() => onOpenPredication(info)}
        className="inline-flex items-center gap-1.5 text-[#0d47a1] font-semibold text-xs cursor-pointer hover:underline"
      >
        {info.mediaType === "video" ? <IconPlay /> : <IconHeadphones />}
        {info.mediaType === "video" ? "Voir la vidéo" : "Écouter l'audio"}
      </span>
    );
  }
  return <span className="text-slate-700">{info[colKey]}</span>;
}

function PredicationsTable({ predications, colonnes, onOpenPredication }) {
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
          {predications.length === 0 ? (
            <tr>
              <td colSpan={colonnes.length} className="py-4 px-4 text-slate-500">
                Aucune prédication
              </td>
            </tr>
          ) : (
            predications.map((info) => (
              <tr key={info.id} className="hover:bg-slate-50">
                {colonnes.map((col) => (
                  <td
                    key={col.key}
                    className={`py-2 px-4 border-b border-slate-200 whitespace-nowrap ${
                      col.key === "operation" ? "w-48 max-[900px]:w-20 max-[900px]:px-2" : ""
                    }`}
                  >
                    <CellValue colKey={col.key} info={info} onOpenPredication={onOpenPredication} />
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
        Ajouter une prédication
      </button>
    </div>
  );
}

// Menu contextuel (modale) affichant le lecteur audio/vidéo de la prédication.
function PredicationModal({ info, onClose }) {
  if (!info) return null;

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

        <h3 className="text-lg font-bold text-[#0d47a1] mb-1">{info.themePredication}</h3>
        <p className="text-xs text-slate-500 mb-4">
          {info.orateur} — {info.date}
        </p>

        {info.mediaType === "video" ? (
          <video controls className="w-full rounded-lg" src={info.mediaUrl} />
        ) : (
          <audio controls className="w-full" src={info.mediaUrl} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function PredicationDashboard() {
  // Prédication dont le lecteur est actuellement affiché dans la modale
  // (null = modale fermée)
  const [predicationOuverte, setPredicationOuverte] = useState(null);

  const handleAdd = () => {
    // À brancher plus tard sur la route Laravel d'ajout
    console.log("Ajout d'une prédication demandé");
  };

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
        <DashboardHeader utilisateur={utilisateur} infosEspace={infosEspace} />
        <PredicationsTable
          predications={predications}
          colonnes={colonnes}
          onOpenPredication={setPredicationOuverte}
        />
        <SaveButton onClick={handleAdd} />
      </main>

      <PredicationModal info={predicationOuverte} onClose={() => setPredicationOuverte(null)} />
    </div>
  );
}
