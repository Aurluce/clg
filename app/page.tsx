import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { WorldThread } from "@/components/ui/WorldThread";
import { ConceptCard } from "@/components/ui/ConceptCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { chapels } from "@/lib/mock/content";

const countries = new Set(chapels.map((c) => c.country)).size;

const exploreItems = [
  {
    href: "/predications",
    label: "Prédications",
    title: "Écouter la Parole",
    text: "Les prédications audio et vidéo de nos pasteurs, chapelle par chapelle.",
    icon: (
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    ),
    accent: "royal" as const,
  },
  {
    href: "/chapelles",
    label: "Chapelles",
    title: "Trouver une communauté",
    text: "Une chapelle CLG près de chez vous, où que vous soyez dans le monde.",
    icon: <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />,
    accent: "crimson" as const,
  },
  {
    href: "/temoignages",
    label: "Témoignages",
    title: "Des vies transformées",
    text: "Les témoignages des fidèles : avec Jésus, on peut recommencer et faire mieux.",
    icon: <path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z" />,
    accent: "gold" as const,
  },
];

export default async function HomePage() {
  const dict = await getDictionary();

  return (
    <>
      {/* ============================================================
          HERO
      ============================================================ */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold-100 opacity-60 blur-3xl" />
          <div className="absolute -left-32 top-48 h-96 w-96 rounded-full bg-royal-100 opacity-60 blur-3xl" />
          <div className="bg-dots absolute inset-0 text-royal-300 opacity-25 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        </div>

        <Container className="relative grid items-center gap-14 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24 lg:py-28">
          <div>
            <Eyebrow>{dict.home.eyebrow}</Eyebrow>

            <h1 className="fade-up mt-4 font-display text-4xl font-semibold leading-[1.06] tracking-tight text-royal md:text-6xl lg:text-[4.25rem]">
              {dict.home.title}
            </h1>

            <p className="fade-up fade-up-1 mt-6 max-w-xl font-body text-lg leading-relaxed text-slate">
              {dict.home.subtitle}
            </p>

            <div className="fade-up fade-up-2 mt-10 flex flex-wrap gap-4">
              <Button href="/chapelles" variant="primary">
                {dict.home.cta_primary}
                <span aria-hidden="true">→</span>
              </Button>

              <Button href="/predications" variant="secondary">
                {dict.home.cta_secondary}
              </Button>
            </div>
          </div>

          {/* Médaillon logo */}
          <div className="flex justify-center md:justify-end">
            <div className="relative h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80">
              <span
                aria-hidden="true"
                className="absolute -inset-6 rounded-full border border-dashed border-gold/50"
              />
              <span
                aria-hidden="true"
                className="absolute -inset-3 rounded-full border border-royal-100"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 animate-pulse rounded-full bg-gold-100 blur-2xl"
              />
              <Image
                src="/images/logo/clg-logo.jpeg"
                alt="Church of the Living God"
                fill
                sizes="(min-width: 768px) 320px, 256px"
                className="relative rounded-full object-cover shadow-xl ring-4 ring-paper"
                priority
              />
            </div>
          </div>
        </Container>

        {/* Bandeau statistiques */}
        <Container className="relative pb-14 md:pb-20">
          <dl className="fade-up fade-up-3 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-royal-100 bg-royal-100 shadow-sm sm:grid-cols-3">
            {[
              { value: `${chapels.length}`, label: "Chapelles à travers le monde" },
              { value: `${countries}`, label: "Pays touchés par l'Évangile" },
              { value: "1", label: "Message : recommencer avec Jésus" },
            ].map((stat) => (
              <div key={stat.label} className="bg-paper-light px-6 py-6 text-center sm:text-left">
                <dt className="order-2 mt-1 block font-body text-xs uppercase tracking-[0.15em] text-slate">
                  {stat.label}
                </dt>
                <dd className="font-display text-4xl font-bold text-royal">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <WorldThread className="text-gold" />

      {/* ============================================================
          CONCEPTS — les deux piliers du message CLG
      ============================================================ */}
      <Section>
        <SectionHeading
          eyebrow="Notre fondement"
          title={dict.concepts.heading}
          lead="Deux vérités portées par toute l'Église, dans chaque chapelle, dans chaque pays."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ConceptCard
            index="01"
            title={dict.concepts.pillar.title}
            text={dict.concepts.pillar.text}
            accent="royal"
          />
          <ConceptCard
            index="02"
            title={dict.concepts.restart.title}
            text={dict.concepts.restart.text}
            accent="crimson"
          />
        </div>
      </Section>

      <WorldThread className="text-gold" />

      {/* ============================================================
          EXPLORER
      ============================================================ */}
      <Section>
        <SectionHeading
          eyebrow="Explorer"
          title="Vivez la vie de l'Église en ligne"
          lead="Trois portes d'entrée pour suivre les activités de la CLG, où que vous soyez."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {exploreItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex h-full flex-col rounded-xl border border-royal-100 bg-paper p-7 no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-royal-300 hover:shadow-lg hover:shadow-royal-100/60"
            >
              <span
                aria-hidden="true"
                className={[
                  "inline-flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110",
                  item.accent === "royal" && "bg-royal-50 text-royal",
                  item.accent === "crimson" && "bg-crimson-100 text-crimson",
                  item.accent === "gold" && "bg-gold-100 text-gold-700",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </span>

              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-slate-light">
                {item.label}
              </p>

              <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug text-royal transition-colors group-hover:text-royal-700">
                {item.title}
              </h3>

              <p className="mt-2.5 font-body text-sm leading-relaxed text-slate">
                {item.text}
              </p>

              <span className="mt-auto inline-flex items-center gap-2 pt-6 font-body text-sm font-medium text-crimson">
                Découvrir
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* ============================================================
          APPEL À L'ACTION FINAL
      ============================================================ */}
      <CTABand
        eyebrow="Rejoignez-nous"
        title="Vous cherchez une église près de chez vous ?"
        text="Nos chapelles vous accueillent chaque semaine pour la louange, la prière et l'enseignement de la Parole."
        primaryLabel="Trouver ma chapelle"
        primaryHref="/chapelles"
        secondaryLabel="Nous contacter"
        secondaryHref="/contact"
      />
    </>
  );
}