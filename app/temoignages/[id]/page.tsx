import type { Metadata } from "next";
import { TestimonyDetail } from "@/components/content/TestimonyDetail";

export const metadata: Metadata = {
  title: "Témoignage — CLG",
  description: "Lisez ou écoutez un témoignage de la communauté CLG et partagez un encouragement.",
};

export default async function TestimonyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TestimonyDetail id={id} />;
}
