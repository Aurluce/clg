import React from "react";
import img1 from "./assets/convention-2023.jpg"
/* ------------------------------------------------------------------ */
/*  DONNÉES — un élément par carte du menu.                            */
/*  "image" : chemin vers la vraie photo (à déposer dans public/       */
/*  ou à servir via Storage::url() côté Laravel). Tant que le fichier  */
/*  n'existe pas, le dégradé + l'icône restent visibles automatiquement */
/*  grâce au onError du <img>.                                         */
/* ------------------------------------------------------------------ */

const menuItems = [
  {
    id: "predication",
    label: "Publier Prédication|Témoignage",
    icon: "🎙️",
    gradient: "linear-gradient(160deg, #e0f2fe, #7dd3fc)",
    image: img1,
  },
  {
    id: "chapelle",
    label: "Trouver une chapelle|cellule",
    icon: "⛪",
    gradient: "linear-gradient(160deg, #fef3c7, #fcd34d)",
    image: img1,
  },
  {
    id: "genese",
    label: "Genèse CLG",
    icon: "📖",
    gradient: "linear-gradient(160deg, #dcfce7, #86efac)",
    image: img1,
  },
  {
    id: "ouvrages",
    label: "Ouvrages de Ap. Beaudelaire",
    icon: "📚",
    gradient: "linear-gradient(160deg, #fae8ff, #f0abfc)",
    image: img1,
  },
  {
    id: "croisade",
    label: "Croisade d'évangélisation",
    icon: "✝️",
    gradient: "linear-gradient(160deg, #ede9fe, #c4b5fd)",
    image:img1,
  },
  {
    id: "dons",
    label: "Dons",
    icon: "💝",
    gradient: "linear-gradient(160deg, #ffe4e6, #fda4af)",
    image: img1,
  },
  {
    id: "contact",
    label: "Contact",
    icon: "📞",
    gradient: "linear-gradient(160deg, #fee2e2, #fca5a5)",
    image: img1
  },
];

/* ------------------------------------------------------------------ */
/*  Sous-composants                                                    */
/* ------------------------------------------------------------------ */

// Zone "photo" de la carte : dégradé + icône visibles par défaut,
// automatiquement masqués dès que la vraie image charge avec succès.
function MenuThumb({ item }) {
  return (
    <div
      className="relative flex items-center justify-center aspect-[4/3] w-full text-[42px] overflow-hidden"
      style={{ background: item.gradient }}
    >
      {item.icon}
      <img
        src={item.image}
        alt={item.label}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

function MenuCard({ item, onSelect }) {
  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_6px_16px_rgba(15,23,42,0.08)] hover:shadow-[0_10px_22px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all cursor-pointer"
    >
      <MenuThumb item={item} />
      <div className="px-3.5 pt-3 pb-4 text-center font-bold text-sm text-blue-700">
        {item.label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */

export default function MenuCardsGrid() {
  const handleSelect = (item) => {
    // À brancher plus tard sur la navigation/route correspondante
    console.log("Rubrique sélectionnée :", item.id);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased px-5 py-8 sm:px-8">
      <h1 className="max-w-[1100px] mx-auto mb-6 text-xl font-bold text-slate-900">
        Espace <span className="text-blue-700">CLG</span> — Menu
      </h1>

      <div className="max-w-[1100px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {menuItems.map((item) => (
          <MenuCard key={item.id} item={item} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
