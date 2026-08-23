
import Link from "next/link";
import Image from "next/image";
import type { Dictionary } from "@/i18n/config";

import { Container } from "@/components/ui/Container";
import { WorldThread } from "@/components/ui/WorldThread";

export function Footer({ dict }: { dict: Dictionary }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 overflow-hidden bg-royal text-paper sm:mt-24">
      <Container className="py-12 sm:py-14 lg:py-16">
        {/* Decorative world thread */}
        <WorldThread className="mb-10 text-gold sm:mb-12" />

        {/* ============================================================
            MAIN FOOTER
        ============================================================ */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-8">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3 no-underline"
            >
              <Image
                src="/images/logo/clg-logo.jpeg"
                alt="Church of the Living God"
                width={48}
                height={48}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/40 transition-transform duration-300 group-hover:scale-105"
              />

              <div>
                <span className="block font-display text-base font-semibold text-paper sm:text-lg">
                  Church of the Living God
                </span>

                <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.2em] text-royal-200">
                  CLG
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-sm font-body text-sm leading-6 text-royal-100">
              {dict.footer.tagline}
            </p>

            {/* Donation CTA */}
            <Link
              href="/dons"
              className="mt-6 inline-flex items-center rounded-md border border-gold/50 px-4 py-2.5 font-body text-xs font-semibold text-gold no-underline transition-all duration-200 hover:border-gold hover:bg-gold hover:text-royal"
            >
              {dict.nav.donations}
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              {dict.nav.about}
            </h2>

            <nav className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                {dict.nav.home}
              </Link>

              <Link
                href="/clg"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                {dict.nav.about}
              </Link>

              <Link
                href="/programmes"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                Programmes
              </Link>

              <Link
                href="/chapelles"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                {dict.nav.chapels}
              </Link>
            </nav>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              Ressources
            </h2>

            <nav className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/predications"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                {dict.nav.sermons}
              </Link>

              <Link
                href="/temoignages"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                {dict.nav.testimonies}
              </Link>

              <Link
                href="/evangelisation"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                {dict.nav.evangelization}
              </Link>

              <Link
                href="/ouvrages"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                {dict.nav.books}
              </Link>

              <Link
                href="/conventions"
                className="font-body text-sm text-royal-100 no-underline transition-colors hover:text-gold"
              >
                {dict.nav.conventions}
              </Link>
            </nav>
          </div>

          {/* Contact / Community */}
          <div>
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              {dict.nav.contact}
            </h2>

            <div className="mt-4 space-y-3 font-body text-sm text-royal-100">
              <Link
                href="/contact"
                className="block no-underline transition-colors hover:text-gold"
              >
                {dict.nav.contact}
              </Link>

              <Link
                href="/chapelles"
                className="block no-underline transition-colors hover:text-gold"
              >
                Trouver une chapelle
              </Link>

              <Link
                href="/conventions"
                className="block no-underline transition-colors hover:text-gold"
              >
                Conventions
              </Link>
            </div>

            {/* Language */}
            <div className="mt-6">
              <span className="font-body text-xs uppercase tracking-wider text-royal-300">
                Language
              </span>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="rounded border border-royal-300 px-3 py-1.5 text-xs text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  FR
                </button>

                <button
                  type="button"
                  className="rounded border border-royal-300 px-3 py-1.5 text-xs text-paper transition-colors hover:border-gold hover:text-gold"
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            SEPARATOR
        ============================================================ */}
        <div className="my-10 h-px bg-royal-300/30 sm:my-12" />

        {/* ============================================================
            BOTTOM FOOTER
        ============================================================ */}
        <div className="flex flex-col gap-4 text-xs text-royal-300 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">
            © {currentYear} CLG. {dict.footer.rights}
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/mentions-legales"
              className="font-body no-underline transition-colors hover:text-gold"
            >
              Mentions légales
            </Link>

            <Link
              href="/confidentialite"
              className="font-body no-underline transition-colors hover:text-gold"
            >
              Confidentialité
            </Link>

            <Link
              href="/contact"
              className="font-body no-underline transition-colors hover:text-gold"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
