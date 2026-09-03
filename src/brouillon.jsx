import React from "react";
export default function Predication(){
    const items = [
        {
            id: 1,
            tag:"PREDICATION . VIDEO",
            title:"Marcher par la foi, non par la vue",
            subtitle:"Apotre T. Beaudelaire . 42 min",
            bgColor: "bg-[#233385]",
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
        <section className="bg-[#555C77] text-[13px] p-6 
        max-w-[393px] mx-auto min-h-screen font-sans ">
            <h2 className="font-serif text-[28px] font-semibold
            text-[#121633] leading-snug tracking-tight mb-3 ">
             Predications & <br />
             temoignages
            </h2>
            <p className="text-[#555C77] text-13px leading-relaxed
            mb-4">
                Publiés en texte, audio ou vidéo — téléchargeables par tous, validés par un administrateur.
                
            </p>
            <div className="flex flex-col gap-4">
                {items.map((item) =>(
                    <div
                    key={item.id}
                    className="bg-white rounded-2xl
                    flex p-4 items-center gap-3 border border-[#E3E7F2]
                    shadow-sm gap-3"
                    >
                    
                    <div className={`w-20 h-20 ${item.bgColor} rounded-2xl flex items-center justify-center shrink-0`}>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center pl-0.5">
                <svg className="w-3.5 h-3.5 text-[#121633] fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            <div className="flex-1 min-w-0">
                <span className="block text-[#555C77]
                text-[10px] font-bold tracking-widest uppercase mb-1">
                    {item.tag}
                </span>
                <h3 className="font-serif text-[15px] font-semibold
               text-[#121633] leading-tight mb-1 ">
                {item.title}
               </h3>
               <p className="text-[#68708C] truncate font-normal
               text-[11px]">
                {item.subtitle}
               </p>
            </div>
             <button className="w-8 h-8 rounded-full border border-[#E3E7F2] flex items-center justify-center text-[#121633] hover:bg-gray-50 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
                    </div>
                ))}
            </div>
        </section>
    )
}