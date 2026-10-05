import { useState } from "react"
import Logo from "./logo"
import { Link } from "react-router-dom"
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
            <Link to="/connexion" className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white" >
              Connexion
            </Link>
            <Link to="/inscription" className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white" >
            Inscription
            </Link>
            <button onClick={()=>setIsOpen(!isOpen) }
            className="min-[900px]:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5" aria-label="Menu">
             <span className="block w-6 h-0.5 bg-black"></span>
             <span className="block w-6 h-0.5 bg-black"></span>
             <span className="block w-6 h-0.5 bg-black"></span>
            </button>
          </div>
          {isOpen && (
             <div className="absolute text-xs right-4 top-full flex min-w-48 flex-col gap-2 rounded-lg bg-white p-4 font-semibold text-[#68708C] shadow-lg min-[900px]:hidden">
            <Link to="/" onClick={() => setIsOpen(false)}>Accueil</Link>
            <Link to="/PredicationsPage" onClick={() => setIsOpen(false)}>Prédications</Link>
            <Link to="/temoignages" onClick={() => setIsOpen(false)}>Témoignages</Link>
            <Link to="/eglisesCLG" onClick={() => setIsOpen(false)}>Chapelles</Link>
            <Link to="/convention" onClick={() => setIsOpen(false)}>Conventions</Link>
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
            <Link to="/">Accueil</Link>
            <Link to="/PredicationsPage">Prédications</Link>
            <Link to="/temoignages">Témoignages</Link>
            <Link to="/eglisesCLG">Chapelles</Link>
            <Link to="/convention">Conventions</Link>
            <div>Dons</div>
            <div>Chant</div>
            <div>Livre</div>
             <div className="flex gap-2">
            <Link to="/connexion" className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 border border-white/20 rounded-full hover:bg-red-400 transition-all"
            >
            Connexion
          </Link>
          <Link to="/inscription" className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 border border-white/20 rounded-full hover:bg-red-400 transition-all"
         >
            Inscription 
          </Link>
          </div>
        </div>
        </div>
          </header>
          
    )
}


