import { useState } from "react"
import Logo from "./logo"
export default function Entete({ setPage }){

const [isOpen,setIsOpen] = useState(0)

    return (
        
      <header className="relative z-50 bg-white p-4">
        <div className="flex items-center justify-between min-[900px]:hidden">
         <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-base tracking-wide text-indigo-600">CLG</span>
          </div>
          <div className="flex gap-2">
            <a href="#" className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white" onClick={() => setPage("connexion")}>
              Connexion
            </a>
            <a href="#" className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white" onClick={() => setPage("inscription")}>
              Inscription
            </a>
            <button onClick={()=>setIsOpen(!isOpen) }
            className="min-[900px]:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5" aria-label="Menu">
             <span className="block w-6 h-0.5 bg-black"></span>
             <span className="block w-6 h-0.5 bg-black"></span>
             <span className="block w-6 h-0.5 bg-black"></span>
            </button>
          </div>
          {isOpen && (
             <div className="absolute text-xs right-4 top-full flex min-w-48 flex-col gap-2 rounded-lg bg-white p-4 font-semibold text-[#68708C] shadow-lg min-[900px]:hidden">
            <div>Accueil</div>
            <div>Prédications</div>
            <div>Témoignages</div>
            <div>Chapelles</div>
            <div>Conventions</div>
            <div>Dons</div>
            <div>Chant</div>
            <div>Livre</div>
            </div>
          )}
        </div>

        <div className="hidden items-center justify-between text-[14px] text-[#68708C] min-[900px]:flex">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-base tracking-wide text-indigo-600">CLG</span>
          </div>
          <div className="flex gap-2 justify-end font-semibold">
            <div>Accueil</div>
            <div>Prédications</div>
            <div>Témoignages</div>
            <div>Chapelles</div>
            <div>Conventions</div>
            <div>Dons</div>
            <div>Chant</div>
            <div>Livre</div>
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
        </div>
        </div>
          </header>
          
    )
}


