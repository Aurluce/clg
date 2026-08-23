import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTABand } from "@/components/ui/CTABand";
import { CampaignCard } from "@/components/content/Cards";
import { campaigns } from "@/lib/mock/content";

export const metadata = {
  title: "Évangélisation — CLG",
  description:
    "Les croisades et campagnes d'évangélisation organisées par la Church of the Living God à travers les chapelles.",
};

export default function EvangelizationPage() {
  return (
    <>
      <PageHero
        eyebrow="Évangélisation"
        title="Croisades et campagnes"
        subtitle="Les croisades d'évangélisation organisées par la CLG à travers les chapelles."
      />

      <Section>
        <SectionHeading
          eyebrow={`${campaigns.length} campagnes à venir`}
          title="Portons l'Évangile dans les villes"
          lead="Chaque croisade est une occasion de partager l'Évangile, de prier pour les malades et d'accueillir de nouveaux croyants."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </Section>

      <CTABand
        eyebrow="Devenez volontaire"
        title="Rejoignez une équipe d'évangélisation"
        text="Intercession, logistique, louange, accueil : il y a une place pour chacun dans les équipes de croisade."
        primaryLabel="Nous contacter"
        primaryHref="/contact"
        secondaryLabel="Voir les chapelles"
        secondaryHref="/chapelles"
      />
    </>
  );
}