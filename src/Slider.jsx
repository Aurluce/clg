import { useState, useEffect } from "react";

// Import des images : adapte le chemin selon l'emplacement de Slider.jsx
import image1 from "./assets/image1.jpg";
import image2 from "./assets/image2.jpg";

const images = [image1, image2];

// Le tableau affiché contient une copie de la 1re image à la fin.
// Elle permet de boucler à l'infini sans saut visible.
const slides = [...images, images[0]];

const WIDTH = 500; // px
const HEIGHT = 300; // px
const DELAY = 3000; // ms entre deux changements

export default function Slider() {
  // On commence sur la dernière diapo (la copie de image1),
  // puis on décrémente : les images entrent par la gauche.
  const [index, setIndex] = useState(images.length);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i - 1);
    }, DELAY);
    return () => clearInterval(timer);
  }, []);

  // Quand on arrive à la 1re diapo, on revient instantanément à la copie
  // (visuellement identique), sans animation.
  const handleTransitionEnd = () => {
    if (index === 0) {
      setAnimate(false);
      setIndex(images.length);
    }
  };

  return (
  <div className="overflow-hidden rounded-lg shadow-md bg-slate-100 w-full max-w-[500px] min-w-0 h-[350px]">
    <div
      className={`flex h-full ${
        animate ? "transition-transform duration-500 ease-in-out" : ""
      }`}
      style={{ transform: `translateX(-${index * 100}%)` }}
      onTransitionEnd={handleTransitionEnd}
    >
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Image ${(i % images.length) + 1}`}
          className="w-full h-full shrink-0 object-contain"
        />
      ))}
    </div>
  </div>
);
}