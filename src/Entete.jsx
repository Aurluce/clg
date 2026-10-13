import { useState } from "react"
import Logo from "./logo"
import { Link } from "react-router-dom"
import { Menu, X, Home, BookOpen, MessageSquare, Church, Calendar, HandHeart, Music, Book, } from "lucide-react"


export default function Entete({ setPage }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Voile sombre sur le reste de la page */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 ease-out min-[900px]:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <header className="relative z-50 bg-white p-4">
        <div className="flex items-center justify-between min-[900px]:hidden">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-bold text-base tracking-wide text-indigo-600">CLG</span>
          </div>

          <div className="flex gap-2">
            <Link to="/connexion" className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white">
              Connexion
            </Link>
            <Link to="/inscription" className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-medium text-white">
              Inscription
            </Link>

            <button
  onClick={() => setIsOpen(!isOpen)}
  className="min-[900px]:hidden flex items-center justify-center w-8 h-8"
  aria-label="Menu"
  aria-expanded={isOpen}
>
  {isOpen ? <X size={24} /> : <Menu size={24} />}
</button>
          </div>

          {/* Le menu est toujours dans le DOM, seules ses classes changent */}
          <div
            className={`absolute  right-4 top-full flex min-w-48 origin-top-right flex-col gap-2 rounded-lg bg-white p-4 font-semibold text-[#68708C] shadow-lg transition-all duration-300 ease-out min-[900px]:hidden ${
              isOpen
                ? "visible translate-y-0 scale-100 opacity-100"
                : "pointer-events-none invisible -translate-y-2 scale-95 opacity-0"
            }`}
          >
           <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
  <Home size={16} /> Accueil
</Link>
<Link to="/PredicationsPage" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
  <BookOpen size={16} /> Prédications
</Link>
<Link to="/temoignages" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
  <MessageSquare size={16} /> Témoignages
</Link>
<Link to="/eglisesCLG" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
  <Church size={16} /> Chapelles
</Link>
<Link to="/convention" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
  <Calendar size={16} /> Conventions
</Link>
<div className="flex items-center gap-2"><HandHeart size={16} /> Dons</div>
<div className="flex items-center gap-2"><Music size={16} /> Chant</div>
<div className="flex items-center gap-2"><Book size={16} /> Livre</div>
           
          </div>
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
              <Link to="/connexion" className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 border border-white/20 rounded-full hover:bg-red-400 transition-all">
                Connexion
              </Link>
              <Link to="/inscription" className="px-4 py-1.5 text-xs font-medium text-white bg-red-600 border border-white/20 rounded-full hover:bg-red-400 transition-all">
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}