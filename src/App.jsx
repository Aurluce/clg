import Compteur from "./compteur"
import PredicationsSection from "./App-predic"
import Logo from "./logo"
import { useState } from "react"
import AuthCreate1 from "./Auth-create1"
import AuthCon2 from "./Auth-con2"

function App() {

  const [page,setPage] = useState("acceuil")
  if(page === "inscription"){
    return (
      <AuthCreate1 />
    );
  } 
  else if(page === "connexion"){
    return (<AuthCon2 />)
  }
  return ( 
    <>
    <div className="w-full max-w-[393px] mx-auto bg-slate-50 min-h-screen text-slate-800 font-sans">
      
      {/* SECTION HAUTE : FOND BLEU PLUS CLAIR */}
      <section className="bg-gradient-to-b from-blue-600 via-indigo-600 to-blue-800 text-white p-4 rounded-b-3xl shadow-lg">
        
        {/* Header */}
        <header className="flex items-center justify-between py-2 mb-6">
          <div className="flex items-center gap-2">
             
           <Logo></Logo>
            <span className="font-bold text-base tracking-wide text-white">CLG</span>
          </div>

          <div className="flex gap-2">
            <a href="#" className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 border border-white/20 rounded-full hover:bg-red-400 transition-all"
            onClick={()=> setPage("connexion")}>
            Connexion
          </a>
          <a href="#" className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 border border-white/20 rounded-full hover:bg-red-400 transition-all"
          onClick={()=> setPage("inscription")}>
            Inscription 
          </a>
          </div>
        </header>

        {/* Bannière d'information */}
        <div className="bg-sky-100 w-full text-indigo-600 font-bold rounded-2xl flex flex-col items-center justify-center p-6 my-4 shadow-inner">
          <h1 className="text-center text-sm font-extrabold tracking-wide">CHURCH OF THE LIVING GOD</h1>
          <p className="text-[10px] text-indigo-500 font-normal">La colonne et l'appui de la vérité</p>
        </div>

        {/* Contenu de la section Hero */}
        <div className="flex flex-col justify-center my-4">
          <span className="text-[11px] font-semibold tracking-widest text-blue-200 uppercase mb-3">
            COMMUNAUTÉ & ŒUVRE
          </span>

          <div className="flex items-center gap-2 text-xs text-pink-300 font-medium mb-4">
            <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse"></span>
            JESUS CHRIST PEUT TE RENDRE LIBRE 
          </div>

          <h1 className="font-serif text-2xl font-bold leading-tight text-white mb-4">
            Avec Jesus on peut recommencer<br />
            et faire mieux.
          </h1>

          <p className="text-xs text-blue-100 leading-relaxed mb-6">
            Prédications, témoignages et vie des chapelles CLG à travers le monde - publiés, archivés et partagés au même endroit.
          </p>

          <div className="flex flex-col gap-3">
            <a href="#" className="w-full py-3 px-4 bg-white text-blue-900 font-semibold text-xs text-center rounded-full shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <span>►</span> Voir la dernière prédication
            </a>

            <a href="#" className="w-full py-3 px-4 bg-white/15 border border-white/30 text-white font-medium text-xs text-center rounded-full hover:bg-white/25 transition-colors">
              Trouver une chapelle
            </a>
          </div>
        </div>
      </section>

      {/* SECTION DU BAS */}
      <div className=" p-8">
        <div className="font-bold text-xl text-indigo-600">Fil d'actualite</div>
        <div>
          Croisades, retraite spirituelle, sujets de priere et annonce 
        </div>


      </div>
      

    </div>
    <PredicationsSection></PredicationsSection>
   </>
  )
}

export default App