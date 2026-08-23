"use client";

import { useState } from "react";

const phrases = [
  "C.L.G ......... CHURCH OF THE LIVING GOD ......... L'appui et la colonne de la vérité.",
  "Avec Jésus on peut recommencer et faire mieux.",
];

export function Marquee() {
  const [index, setIndex] = useState(0);

  return (
    <div className="overflow-hidden whitespace-nowrap bg-royal py-2">
      <span
        key={index}
        onAnimationEnd={() => setIndex((i) => (i + 1) % phrases.length)}
        className="marquee-once font-display text-sm tracking-[0.15em] text-gold"
      >
        {phrases[index]}
      </span>
    </div>
  );
}