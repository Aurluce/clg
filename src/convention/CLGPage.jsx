import React from "react";
import CalvinoBackground from "../bruilllon/CalvinoBackground";

// Images découpées de ta maquette Figma (dossier /public/assets)
import hero from "../assets/hero.jpg";
import c2023 from "../assets/convention-2023.jpg";
import c2024 from "../assets/convention-2024.jpg";
import c2025 from "../assets/convention-2025.jpg";
import c2026 from "../assets/convention-2026.jpg";

const conventions = [
  { year: 2023, img: c2023 },
  { year: 2024, img: c2024 },
  { year: 2025, img: c2025 },
  { year: 2026, img: c2026 },
];

const navLinks = ["Accueil", "Témoignages", "Conventions", "Contact"];

/* Boutons réutilisables (style Calvino : pilule dégradé rose) */
const PrimaryButton = ({ children, className = "", ...props }) => (
  <a
    href="#"
    className={
      "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff4f93] to-[#ff6b6b] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(255,79,147,0.6)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4f93] " +
      className
    }
    {...props}
  >
    {children}
  </a>
);

const GhostButton = ({ children, className = "", ...props }) => (
  <a
    href="#"
    className={
      "inline-flex items-center justify-center rounded-full border border-[#ffd0e2] bg-white px-8 py-3.5 text-[15px] font-semibold text-[#e0357f] transition hover:bg-[#fff2f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4f93] " +
      className
    }
    {...props}
  >
    {children}
  </a>
);

export default function CLGPage() {
  return (
    <CalvinoBackground>
      {/* Polices Calvino : Nunito (titres) + Jost (texte) */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Nunito:wght@700;800&display=swap');`}</style>

      <div className="font-['Jost',sans-serif] text-[#1b2540]">
        {/* ================= NAVBAR ================= */}
        <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
         

         

          <PrimaryButton className="!px-6 !py-3 text-sm">
            S’enregistrer
          </PrimaryButton>
        </header>

        {/* ================= HERO ================= */}
        <section className="relative lg:min-h-[430px]">
         <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 lg:pb-0 lg:pt-16">
          <div className="max-w-md">
            <span className="inline-block rounded-full border border-[#ffd0e2] bg-white px-4 py-1.5 text-xs font-medium text-[#ff4f93]">
              Église du Dieu vivant
            </span>

            <h1 className="mt-6 font-['Nunito',sans-serif] text-4xl font-extrabold leading-[1.15] text-[#131c3a] sm:text-[44px]">
              La colonne et l’appui de la vérité
            </h1>

            <p className="mt-5 max-w-sm text-[17px] leading-relaxed">
              Avec Jésus, on peut recommencer et faire mieux.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryButton>Écouter les témoignages</PrimaryButton>
              <GhostButton>Enregistrer son témoignage</GhostButton>
            </div>
          </div>

         </div>

          {/* Photo ancrée au bord droit de la fenêtre, comme les cercles du fond */}
          <img
            src={hero}
            alt="Le pasteur s’adressant à des fidèles pendant un culte"
            className="mt-0 h-72 rounded-3xl object-cover object-[35%_center] shadow-[0_20px_50px_-20px_rgba(30,40,90,0.35)] sm:h-100 mx-6 w-[calc(100%-3rem)] lg:absolute lg:right-0 lg:top-[-94px] lg:mx-0 lg:mt-0 lg:h-[400px] lg:!w-[530px] lg:rounded-l-[200px] lg:rounded-br-[200px] lg:rounded-tr-[40px] lg:shadow-none"
          />
        </section>

        {/* ================= CONVENTIONS ================= */}
        <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 lg:pt-28">
          <div className="text-center">
            <p className="text-xs font-medium text-[#ff4f93]">Convention CLG</p>
            <h2 className="mt-3 font-['Nunito',sans-serif] text-3xl font-bold leading-snug text-[#131c3a] sm:text-[34px]">
              Puissance et vie
            </h2>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <PrimaryButton className="!px-7 !py-3">S’enregistrer</PrimaryButton>
              <GhostButton className="!px-7 !py-3">Autres conventions</GhostButton>
            </div>
          </div>

          <ul className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {conventions.map(({ year, img }) => (
              <li key={year}>
                <a
                  href="#"
                  className="group block rounded-xl bg-white p-3 shadow-[0_12px_40px_-10px_rgba(120,140,255,0.28)] transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff4f93]"
                >
                  <img
                    src={img}
                    alt={`Convention CLG ${year}`}
                    className="aspect-[5/4] w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                  <span className="mt-4 mb-2 block px-1 font-['Nunito',sans-serif] text-[17px] font-bold text-[#131c3a] transition group-hover:text-[#ff4f93]">
                    Convention {year}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </CalvinoBackground>
  );
}
