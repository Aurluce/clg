import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { LoginForm } from "@/components/content/LoginForm";

export const metadata = {
  title: "Connexion — CLG",
  description:
    "Espace réservé aux membres : connectez-vous pour accéder à votre espace CLG.",
};

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Connexion"
        title="Se connecter"
        subtitle="Accédez à votre espace membre pour suivre les activités de votre chapelle."
      />

      <Section>
        <div className="mx-auto max-w-md">
          <LoginForm />
        </div>
      </Section>
    </>
  );
}