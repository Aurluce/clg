import React from "react";
import { Landmark, Laptop, Cross } from "lucide-react";

// --- Données factices : remplace par les offres venant de ta base Laravel ---
const offres = [
  {
    id: 1,
    entreprise: "Afriland First Bank",
    poste: "Analyste Financier",
    lieu: "Yaounde, cameroun",
    description:
      "Analyser les etats financiers, produire des rapports et accompagner les...",
    tags: [
      { label: "CDI", color: "blue" },
      { label: "Finance", color: "green" },
      { label: "Analyse", color: "blue" },
    ],
    salaire: "300 000-500 000 FCFA",
    icon: Landmark,
    bandeau: "from-blue-100 to-blue-300",
  },
  {
    id: 2,
    entreprise: "CamTech Solutions",
    poste: "Developpeur Web Full-Stack",
    lieu: "Douala, Teletravail possible",
    description:
      "Developper et maintenir des applications web pour des clients PM",
    tags: [
      { label: "CDD", color: "blue" },
      { label: "Tech", color: "green" },
      { label: "React", color: "blue" },
      { label: "Node.js", color: "blue" },
    ],
    salaire: "250 000-400 000 FCFA",
    icon: Laptop,
    bandeau: "from-emerald-100 to-emerald-300",
  },
  {
    id: 3,
    entreprise: "Hopital central de yaounde",
    poste: "Inifirmier(e) Diplome(e)",
    lieu: "Yaounde, Centre",
    description:
      "Assurer les soins aux patients dans le service de medecine interne...",
    tags: [
      { label: "CDI", color: "blue" },
      { label: "Sante", color: "green" },
    ],
    salaire: "180 000-280 000 FCFA",
    icon: Cross,
    bandeau: "from-orange-100 to-orange-300",
  },
];

// Couleurs des badges/tags, centralisées pour rester cohérent
const tagStyles = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
};

function JobCard({ offre }) {
  const Icon = offre.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Bandeau avec icône */}
      <div
        className={`h-32 bg-gradient-to-br ${offre.bandeau} flex items-center justify-center`}
      >
        <Icon className="w-10 h-10 text-gray-700/70" strokeWidth={1.5} />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* En-tête entreprise / icône miniature */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-blue-700 font-medium text-sm">
              {offre.entreprise}
            </p>
            <h3 className="font-bold text-gray-900 leading-snug">
              {offre.poste}
            </h3>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <span>📍</span> {offre.lieu}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {offre.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {offre.tags.map((tag, i) => (
            <span
              key={i}
              className={`text-xs font-semibold px-2 py-1 rounded ${tagStyles[tag.color]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>

        {/* Salaire + bouton, poussés en bas grâce à mt-auto */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-green-700 font-semibold text-sm">
            {offre.salaire}
          </span>
          <button className="bg-blue-800 hover:bg-blue-900 transition-colors text-orange-400 font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-1">
            postuler <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobGrid() {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {offres.map((offre) => (
          <JobCard key={offre.id} offre={offre} />
        ))}
      </div>
    </div>
  );
}
