import { Link } from "react-router-dom";

const PREDICATIONS = [
  {
    id: 1,
    tag: "PRÉDICATION · VIDÉO",
    title: "Marcher par la foi, non par la vue",
    subtitle: "Apôtre T. Beaudelaire · 42 min",
    date: "12 sept. 2026",
    passage: "2 Corinthiens 5:7",
    bgColor: "bg-[#233385]",
    content:
      "Une exhortation à fonder ses décisions sur la promesse de Dieu plutôt que sur les circonstances visibles, à travers les épreuves d'Abraham et de Pierre marchant sur l'eau.",
  },
  {
    id: 2,
    tag: "PRÉDICATION · AUDIO",
    title: "La vigilance du serviteur fidèle",
    subtitle: "Pasteur Ngono · 38 min",
    date: "5 sept. 2026",
    passage: "Matthieu 24:45-51",
    bgColor: "bg-[#B02636]",
    content:
      "Un enseignement sur la parabole du serviteur fidèle et prudent, et sur ce que signifie rester vigilant dans l'attente du retour du Seigneur.",
  },
  {
    id: 3,
    tag: "PRÉDICATION · TEXTE",
    title: "Le pardon comme fondement de la liberté",
    subtitle: "Apôtre T. Beaudelaire · 12 min de lecture",
    date: "29 août 2026",
    passage: "Matthieu 18:21-35",
    bgColor: "bg-[#233385]",
    content:
      "À partir de la parabole du serviteur impitoyable, ce message montre comment le refus de pardonner emprisonne celui qui le porte, et comment le pardon reçu de Dieu doit se transmettre.",
  },
  {
    id: 4,
    tag: "PRÉDICATION · VIDÉO",
    title: "Bâtir sa maison sur le roc",
    subtitle: "Pasteur Fokou · 45 min",
    date: "20 août 2026",
    passage: "Matthieu 7:24-27",
    bgColor: "bg-[#B02636]",
    content:
      "Une réflexion sur ce qui distingue l'auditeur de la Parole de celui qui la met en pratique, et sur les tempêtes qui révèlent la solidité des fondations de notre vie.",
  },
  {
    id: 5,
    tag: "PRÉDICATION · AUDIO",
    title: "La prière qui dérange le ciel",
    subtitle: "Apôtre T. Beaudelaire · 50 min",
    date: "14 août 2026",
    passage: "Luc 18:1-8",
    bgColor: "bg-[#233385]",
    content:
      "Un message sur la persévérance dans la prière, à partir de la parabole de la veuve et du juge inique, et sur la patience de Dieu envers ceux qui crient à lui.",
  },
  {
    id: 6,
    tag: "PRÉDICATION · TEXTE",
    title: "L'Église, un corps, plusieurs membres",
    subtitle: "Pasteur Ngono · 10 min de lecture",
    date: "2 août 2026",
    passage: "1 Corinthiens 12:12-27",
    bgColor: "bg-[#B02636]",
    content:
      "Un enseignement sur la diversité des dons dans l'Église, l'interdépendance des membres du corps de Christ, et l'appel à honorer chaque service, visible ou discret.",
  },
];

export default function PredicationsPage() {
  return (
    <section className="w-full min-h-screen bg-[#F3F5FA] px-4 py-8 font-sans sm:px-6 lg:px-12">
      {/* En-tête */}
      <div className="flex justify-between">
        <div className="max-w-6xl mx-auto mb-6">
        <h1 className="font-serif text-[28px] font-semibold text-indigo-600 leading-snug tracking-tight mb-2">
          Prédications
        </h1>
        <p className="text-[#555C77] text-[13px] leading-relaxed max-w-md">
          Les enseignements publiés en texte, audio ou vidéo. Touchez un titre pour lire ou écouter le message complet.
        </p>
      </div>
      <Link to="formPredication" className="rounded-xl h-[50px] bg-indigo-600 p-5 font-bold
       flex items-center text-center  text-xs font-medium text-white" onClick={() => setPage("inscription")}>
              Enregistrer une predication 
            </Link>
      </div>

      {/* Grille des prédications */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {PREDICATIONS.map((item) => (
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
    <Route path="voirPredication" element={<VoirPredic />} />
            <Link to="/voirPredication" className="bg-blue-600 text-white p-3 rounded">Voir</Link>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}


 