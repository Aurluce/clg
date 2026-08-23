import Image from "next/image";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChoirSongCard } from "@/components/content/Cards";
import { conventions, choirSongs } from "@/lib/mock/content";

const choirGallery = [
  {
    id: 1,
    src: "/images/conventions/choir/choir-1.jpg",
    alt: "Chorale de la CLG pendant la convention",
  },
  {
    id: 2,
    src: "/images/conventions/choir/choir-2.jpg",
    alt: "Chorale de la CLG sur scène",
  },
  {
    id: 3,
    src: "/images/conventions/choir/choir-3.jpg",
    alt: "Chorale pendant un moment de louange",
  },
  {
    id: 4,
    src: "/images/conventions/choir/choir-4.jpg",
    alt: "Chorale de la CLG",
  },
  {
    id: 5,
    src: "/images/conventions/choir/choir-5.jpg",
    alt: "Chorale pendant la convention",
  },
  {
    id: 6,
    src: "/images/conventions/choir/choir-6.jpg",
    alt: "Moment de louange de la chorale",
  },
];

export default async function ConventionChoirsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const convention = conventions.find((c) => c.slug === slug);

  if (!convention) {
    notFound();
  }

  return (
    <>
      {/* =========================================================
          HERO
      ========================================================= */}
      <PageHero
        eyebrow={convention.title}
        title="Chants des chorales"
        subtitle="Découvrez les chants, les paroles, les enregistrements et les moments forts des chorales pendant la convention."
      />

      {/* =========================================================
          CHANTS
      ========================================================= */}
      <Section>
        <SectionHeading
          eyebrow={`${choirSongs.length} chants`}
          title="Louange et adoration"
          lead="Retrouvez les paroles et les enregistrements vidéo des chants interprétés pendant la convention."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {choirSongs.map((song) => (
            <ChoirSongCard
              key={song.id}
              song={song}
            />
          ))}
        </div>
      </Section>

      {/* =========================================================
          GALERIE
      ========================================================= */}
      <Section className="bg-paper-light">
        <SectionHeading
          eyebrow={`${choirGallery.length} photos`}
          title="Galerie de la chorale"
          lead="Revivez en images les moments de louange et de célébration de la chorale pendant la convention."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {choirGallery.map((image, index) => (
            <div
              key={image.id}
              className={[
                "group relative overflow-hidden rounded-xl",
                "border border-royal-100 bg-paper",
                "shadow-sm transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg",
                index === 0
                  ? "col-span-2 row-span-2"
                  : "",
              ].join(" ")}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                      : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  }
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-royal-900/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* View icon */}
                <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-royal opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                    />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}