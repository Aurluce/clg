import React from "react";

// --- Données : remplace par tes vraies églises (venant de ta base si besoin) ---
const churches = [
  {
    id: 1,
    ville: "Bafoussam",
    lieu: "Maeture",
    description: "La puissance de l'esprit saint qui sauve et rend libre",
    tags: [
      { label: "puissance", color: "blue" },
      { label: "vie", color: "green" },
    ],
    icon: "✝️",
    bandeau: "from-blue-100 to-blue-300",
  },
  {
    id: 2,
    ville: "Yaounde",
    lieu: "Bastos",
    description:
      "Avec Dieu nous ferons des exploits. Quel que soit ton problème, Jésus a la solution",
    tags: [
      { label: "puissance", color: "blue" },
      { label: "vie", color: "green" },
    ],
    icon: "✝️",
    bandeau: "from-purple-100 to-purple-300",
  },
  {
    id: 3,
    ville: "Bertoua",
    lieu: "Centre ville",
    description:
      "Briser les chaines de l'esclavage et marcher de gloire en gloire avec Christ",
    tags: [
      { label: "puissance", color: "blue" },
      { label: "vie", color: "green" },
    ],
    icon: "✝️",
    bandeau: "from-emerald-100 to-emerald-300",
  },
     {
    id: 4,
    ville: "Bertoua",
    lieu: "Centre ville",
    description:
      "Briser les chaines de l'esclavage et marcher de gloire en gloire avec Christ",
    tags: [
      { label: "puissance", color: "blue" },
      { label: "vie", color: "green" },
    ],
    icon: "✝️",
    bandeau: "from-emerald-100 to-emerald-300",
  },
];

// Couleurs des badges/tags, centralisées pour rester cohérent
const tagStyles = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
};

function ChurchCard({ church }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Bandeau coloré avec l'icône — hauteur réduite sur mobile */}
      <div
        className={`h-20 md:h-32 bg-gradient-to-br ${church.bandeau} flex items-center justify-center`}
      >
        <span className="text-2xl md:text-4xl">{church.icon}</span>
      </div>

      <div className="p-3 md:p-5 flex flex-col flex-1">
        {/* En-tête ville / lieu */}
        <div className="mb-1.5 md:mb-3">
          <p className="text-blue-700 font-medium text-xs md:text-sm">
            {church.ville}
          </p>
          <h3 className="font-bold text-gray-900 leading-snug text-sm md:text-base">
            {church.lieu}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mb-2 md:mb-4">
          {church.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-4">
          {church.tags.map((tag, i) => (
            <span
              key={i}
              className={`text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded ${tagStyles[tag.color]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Bouton, poussé en bas grâce à mt-auto */}
        <div className="flex items-center justify-end mt-auto pt-1 md:pt-2">
          <button className="bg-blue-800 hover:bg-blue-900 transition-colors text-orange-400 font-semibold text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1">
            visiter <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChurchGrid2() {
  return (
    <>
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-[400px] md:max-w-6xl mx-auto">
        {churches.map((church) => (
          <ChurchCard key={church.id} church={church} />
        ))}
      </div>
    </div>
    </>
  );
}
