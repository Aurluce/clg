import React from 'react';

export default function PredicationsSection() {
  const items = [
    {
      id: 1,
      tag: "PRÉDICATION · VIDÉO",
      title: "Marcher par la foi, non par la vue",
      subtitle: "Apôtre T. Beaudelaire · 42 min",
      bgColor: "bg-[#233385]", // Bleu foncé
    },
    {
      id: 2,
      tag: "TÉMOIGNAGE · AUDIO",
      title: "Guérison après 6 ans de lutte",
      subtitle: "Sœur Delphine · Chapelle de Yaoundé",
      bgColor: "bg-[#B02636]", // Rouge
    },
    {
      id: 3,
      tag: "PRÉDICATION · TEXTE",
      title: "La vigilance du serviteur fidèle",
      subtitle: "Pasteur Ngono · 8 min de",
      bgColor: "bg-[#233385]", // Bleu foncé
    },
  ];

  return (
    <section className="bg-[#F3F5FA] p-6 max-w-[393px] mx-auto min-h-screen font-sans">
      
      {/* Grand Titre */}
      <h2 className="font-serif text-[28px] font-semibold text-indigo-600 leading-snug tracking-tight mb-3">
        Prédications &<br />
        témoignages
      </h2>

      {/* Description */}
      <p className="text-[#555C77] text-[13px] leading-relaxed mb-4">
        Publiés en texte, audio ou vidéo — téléchargeables par tous, validés par un administrateur.
      </p>

      {/* Lien Bibliothèque */}
   

      {/* Liste des Cartes */}
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-[#E3E7F2] shadow-sm"
          >
            {/* Vignette avec bouton Play */}
            <div className={`w-20 h-20 ${item.bgColor} rounded-2xl flex items-center justify-center shrink-0`}>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center pl-0.5">
                <svg className="w-3.5 h-3.5 text-[#121633] fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Contenu Texte */}
            <div className="flex-1 min-w-0">
              {/* Tag / Catégorie */}
              <span className="block text-[#555C77] text-[10px] font-bold tracking-widest uppercase mb-1">
                {item.tag}
              </span>

              {/* Titre de la carte */}
              <h3 className="font-serif text-[15px] font-semibold text-[#121633] leading-tight mb-1">
                {item.title}
              </h3>

              {/* Auteur & Durée */}
              <p className="text-[#68708C] text-[11px] font-normal truncate">
                {item.subtitle}
              </p>
            </div>

            {/* Bouton Télécharger */}
            <button className="w-8 h-8 rounded-full border border-[#E3E7F2] flex items-center justify-center text-[#121633] hover:bg-gray-50 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
            
          </div>

          
        ))}
    <div className="flex gap-2 justify-end mb-6">
        <a href="#" className="text-[#2B39B0]  text-[13px] font-bold hover:underline inline-flex items-center gap-1">
          Voir plus 
        </a>
        
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-3 font-semibold">
        <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Publier Predication|Temoignage
        </div>
          <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Trouver une chapelle|cellule
        </div>
        <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Convention
        </div>
         <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Genese CLG 
        </div>
         <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Convention
        </div>
        

      </div>
      <div className="flex flex-col gap-3 font-semibold">
       <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Ouvrages de Ap. Beaudelaire
        </div>
         <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Croisade d'evangelisation
        </div>
         <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Chants et cantiques
        </div>
         <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Programme CLG
        </div>
         <div className="bg-sky-200 text-[14px] p-2
        text-blue-600 rounded-2xl w-[165px] ">
            Convention
        </div>

      </div>
    
      </div>
      </div>

    </section>
  );
}