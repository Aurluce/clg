import { Link } from "react-router-dom";
import MyTestimony from "./FormTem2";
import { useState } from "react";
const TEMOIGNAGES = [
  {
    id: 1,
    tag: "TÉMOIGNAGE · AUDIO",
    title: "Guérison après 6 ans de lutte",
    subtitle: "Sœur Delphine · Chapelle de Yaoundé",
    date: "12 sept. 2026",
    bgColor: "bg-[#B02636]",
    content:
      "Après six années marquées par la maladie, Sœur Delphine raconte comment sa foi a été le socle de sa persévérance, et comment sa guérison a renforcé la communauté qui priait avec elle chaque semaine.",
  },
  {
    id: 2,
    tag: "TÉMOIGNAGE · VIDÉO",
    title: "Restauré après la perte de mon emploi",
    subtitle: "Frère Armand · Cellule de Bafoussam",
    date: "5 sept. 2026",
    bgColor: "bg-[#233385]",
    content:
      "Frère Armand revient sur la période difficile qui a suivi la perte de son emploi, et sur la manière dont sa communauté d'église l'a soutenu jusqu'à ce qu'une nouvelle opportunité se présente.",
  },
  {
    id: 3,
    tag: "TÉMOIGNAGE · TEXTE",
    title: "Une réconciliation familiale inattendue",
    subtitle: "Sœur Christelle · Chapelle de Douala",
    date: "29 août 2026",
    bgColor: "bg-[#B02636]",
    content:
      "Après des années de silence avec sa sœur, Christelle partage le cheminement de prière et de pardon qui a permis à leur relation de se reconstruire.",
  },
  {
    id: 4,
    tag: "TÉMOIGNAGE · AUDIO",
    title: "Libéré d'une dépendance de longue date",
    subtitle: "Frère Ismaël · Cellule de Bonabéri",
    date: "20 août 2026",
    bgColor: "bg-[#233385]",
    content:
      "Ismaël raconte son parcours de délivrance, les rechutes, et l'accompagnement d'un groupe de prière qui ne l'a jamais laissé seul face à sa dépendance.",
  },
  {
    id: 5,
    tag: "TÉMOIGNAGE · VIDÉO",
    title: "Un mariage sauvé par la prière",
    subtitle: "Couple Nguemo · Chapelle de Yaoundé",
    date: "14 août 2026",
    bgColor: "bg-[#B02636]",
    content:
      "Le couple Nguemo témoigne des mois de tension qui ont précédé leur décision de prier ensemble chaque soir, et de la transformation progressive de leur foyer.",
  },
  {
    id: 6,
    tag: "TÉMOIGNAGE · TEXTE",
    title: "Un examen réussi contre toute attente",
    subtitle: "Frère Judicaël · Cellule universitaire",
    date: "2 août 2026",
    bgColor: "bg-[#233385]",
    content:
      "Judicaël partage comment, après un premier échec, il a repris ses études avec le soutien de sa cellule de prière et obtenu son diplôme cette année.",
  },
];

export default function TemoignagesPage() {

  const [open, setOpen] = useState(false)
  
  return (
    <section className="w-full min-h-screen bg-[#F3F5FA] px-4 py-8 font-sans sm:px-6 lg:px-12">
      {/* En-tête */}
      <div className="flex justify-between">
        <div className="max-w-6xl mx-auto mb-6">
        <h1 className="font-serif text-[28px] font-semibold text-indigo-600 leading-snug tracking-tight mb-2">
          Témoignages
        </h1>
        <p className="text-[#555C77] text-[13px] leading-relaxed max-w-md">
          Des vies transformées, racontées par ceux qui les ont vécues. Touchez un titre pour lire le témoignage complet.
        </p>
      </div>
       <Link to="formTemoignage"  className="rounded-xl h-[50px] bg-indigo-600 p-5 font-bold
       flex items-center text-center  text-xs font-medium text-white" onClick={() => setOpen(true)}>
              Enregistrer votre temoignage 
            </Link>
           
      </div>

      {/* Grille des témoignages */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {TEMOIGNAGES.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 flex flex-col gap-3 border border-[#E3E7F2] shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center shrink-0`}
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center pl-0.5">
                  <svg
                    className="w-3 h-3 text-[#121633] fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <span className="text-[#555C77] text-[10px] font-bold tracking-widest uppercase">
                {item.tag}
              </span>
            </div>

            <p className="font-serif text-[15px] font-semibold text-[#121633] leading-tight">
              {item.title}
            </p>

            <div className="flex justify-between">
              <p className="text-[#68708C] text-[11px] font-normal">
              {item.subtitle} · {item.date}
            </p>
            <Link to="/voir-tem" className="bg-blue-600 text-white p-3 rounded">Voir</Link>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}


 