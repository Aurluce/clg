import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-indigo-700 text-white px-4 py-3 relative">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <span className="font-bold text-lg">MonSite</span>

        {/* Bouton hamburger - visible seulement sur mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>

        {/* Liens - visibles directement sur grand écran */}
        <div className="hidden sm:flex gap-6">
          <a href="#" className="hover:text-indigo-200">Accueil</a>
          <a href="#" className="hover:text-indigo-200">Services</a>
          <a href="#" className="hover:text-indigo-200">Contact</a>
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {isOpen && (
        <div className="sm:hidden flex flex-col gap-4 mt-4 pb-2">
          <a href="#" className="hover:text-indigo-200">Accueil</a>
          <a href="#" className="hover:text-indigo-200">Services</a>
          <a href="#" className="hover:text-indigo-200">Contact</a>
        </div>
      )}
    </nav>
  );
}