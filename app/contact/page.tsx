import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/content/ContactForm";

export const metadata = {
  title: "Contact — CLG",
  description:
    "Contactez la Church of the Living God : questions, prières, implantation de chapelles ou partenariats.",
};

const channels = [
  {
    title: "Une question sur l'Église",
    text: "Notre équipe vous répond sur la foi, les activités et l'organisation de la CLG.",
  },
  {
    title: "Trouver une chapelle",
    text: "Nous vous orientons vers la chapelle CLG la plus proche de chez vous.",
  },
  {
    title: "Implanter une chapelle",
    text: "Vous souhaitez ouvrir une chapelle dans votre ville ? Parlons-en.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Nous contacter"
        subtitle="Une question, une demande de prière, un projet ? Écrivez-nous, nous vous répondrons avec joie."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* Panneau d'information */}
          <aside className="relative overflow-hidden rounded-xl bg-royal p-8 text-paper shadow-md md:p-10">
            <div
              aria-hidden="true"
              className="bg-dots-lg pointer-events-none absolute inset-0 text-paper opacity-[0.07]"
            />

            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                Comment pouvons-nous aider ?
              </p>

              <ul className="mt-7 space-y-7">
                {channels.map((channel) => (
                  <li key={channel.title} className="border-l-2 border-gold/60 pl-4">
                    <p className="font-display text-base font-semibold">{channel.title}</p>
                    <p className="mt-1 font-body text-sm leading-relaxed text-royal-100">
                      {channel.text}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-9 border-t border-paper/20 pt-6">
                <p className="font-body text-sm leading-relaxed text-royal-100">
                  Vous pouvez aussi passer directement par la chapelle la plus proche de chez
                  vous.
                </p>
              </div>
            </div>
          </aside>

          {/* Formulaire (composant client) */}
          <ContactForm />
        </div>
      </Section>
    </>
  );
}