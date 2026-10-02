import React from "react";

/**
 * Background du template "Calvino" (sans textes ni photo).
 * Mise en page de référence : ~1115px de large. Les positions en px
 * viennent de cette maquette ; ajuste-les si ta page est plus haute/large.
 *
 * Usage :
 *   <CalvinoBackground>
 *     ...ton contenu (relative z-10)...
 *   </CalvinoBackground>
 */
export default function CalvinoBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* ---------- Décors (derrière le contenu) ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* ===== HERO ===== */}

        {/* Halo rose pâle en haut à gauche */}
        <div className="absolute -left-40 top-16 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,#fff0f6_0%,#fff7fa_45%,transparent_72%)]" />

        {/* Petit cercle dégradé bleu -> rose (bord gauche) */}
        <div className="absolute -left-5 top-[317px] h-[82px] w-[82px] rounded-full bg-gradient-to-b from-[#c4c8fb] to-[#fcd3ee]" />

        {/* Petit triangle bleu */}
        <svg
          className="absolute left-[92px] top-[96px] h-4 w-4 text-[#a9b7f6]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 3.5c.6 0 1.1.3 1.4.8l8 13.5c.6 1-.1 2.2-1.4 2.2H4c-1.3 0-2-1.2-1.4-2.2l8-13.5c.3-.5.8-.8 1.4-.8z"
          />
        </svg>

        {/* Petite croix violette */}
        <svg
          className="absolute left-[58.8%] top-[368px] h-4 w-4 text-[#8f7cf5]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>

        {/* Grand cercle lavande derrière l'image (arc visible à gauche) */}
        <div className="absolute -right-20 -top-28 hidden lg:block h-[640px] w-[640px] rounded-full bg-gradient-to-b from-[#e8ecff] via-[#f0f2ff] to-transparent" />

        {/* Cercle rose (croissant visible sous l'image) */}
        <div className="absolute -right-24 -top-52 hidden lg:block h-[640px] w-[640px] rounded-full bg-[#ffb1b7]" />

        {/* ===== SERVICES ===== */}

        {/* Grand cercle bleu très pâle à gauche */}
        <div className="absolute left-9 top-[482px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle_at_center,#f3f6ff_0%,#f7f9ff_60%,#fbfcff_100%)]" />

        {/* Halo rose pâle à droite */}
        <div className="absolute right-6 top-[420px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,#fff1f4_0%,#fff7f9_50%,transparent_72%)]" />

        {/* Grille de points en bas à droite */}
        <div className="absolute right-[198px] top-[617px] h-[200px] w-[210px] bg-[radial-gradient(#d3d7ec_1.2px,transparent_1.6px)] [background-size:17px_17px] [mask-image:linear-gradient(135deg,black,transparent_95%)]" />
      </div>

      {/* ---------- Contenu ---------- */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
