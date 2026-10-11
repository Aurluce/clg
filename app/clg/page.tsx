import type { Metadata } from "next";
import { ChurchPage } from "@/components/content/ChurchPage";

export const metadata: Metadata = {
  title: "La CLG — Church of the Living God",
  description: "Découvrez la Church of the Living God : sa genèse, sa vision et ses objectifs.",
};

export default function AboutPage() {
  return <ChurchPage />;
}
