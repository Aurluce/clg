import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { getDictionary } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Marquee } from "@/components/ui/Marquee";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CLG — Church of the Living God",
  description:
    "Plateforme officielle de la Church of the Living God : chapelles, prédications, témoignages, conventions et dons.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const dict = await getDictionary();

  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-full flex flex-col bg-paper text-charcoal font-body antialiased">
        <Marquee />
        <Header dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}