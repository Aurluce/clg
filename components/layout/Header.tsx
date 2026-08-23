
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/i18n/config";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const navKeys = [
  "home",
  "about",
  "chapels",
  "sermons",
  "testimonies",
  "evangelization",
  "books",
  "conventions",
] as const;

const navHrefs: Record<(typeof navKeys)[number], string> = {
  home: "/",
  about: "/clg",
  chapels: "/chapelles",
  sermons: "/predications",
  testimonies: "/temoignages",
  evangelization: "/evangelisation",
  books: "/ouvrages",
  conventions: "/conventions",
};

export function Header({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-royal-100/80 bg-paper-light/95 backdrop-blur-md">
      <Container className="w-full">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-[72px] lg:h-20">

          {/* ============================================================
              LOGO
          ============================================================ */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
          >
            <Image
              src="/images/logo/clg-logo.jpeg"
              alt="Church of the Living God"
              width={44}
              height={44}
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-royal-100 sm:h-11 sm:w-11"
              priority
            />

            <div className=" min-w-0 xs:block sm:block">
              <span className="block truncate font-display text-sm font-semibold leading-tight text-royal sm:text-base">
                Church of the Living God
              </span>

              <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.2em] text-slate sm:text-[10px]">
                CLG
              </span>
            </div>
          </Link>

          {/* ============================================================
              DESKTOP / LARGE TABLET NAVIGATION
          ============================================================ */}
          <nav
            className="hidden flex-1 items-center justify-center lg:flex"
            aria-label="Navigation principale"
          >
            <div className="flex items-center gap-0.5 xl:gap-1">
              {navKeys.map((key) => {
                const href = navHrefs[key];
                const active = isActive(href);

                return (
                  <Link
                    key={key}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "relative whitespace-nowrap rounded-md px-2 py-2",
                      "text-[12px] font-medium xl:px-2.5 xl:text-[13px]",
                      "transition-colors duration-200",
                      active
                        ? "text-royal"
                        : "text-slate hover:bg-royal-50 hover:text-royal",
                    ].join(" ")}
                  >
                    {dict.nav[key]}

                    {active && (
                      <span
                        className="absolute bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-crimson"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ============================================================
              ACTIONS DESKTOP
          ============================================================ */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <Button
              href="/login"
              variant="secondary"
              className="whitespace-nowrap px-3 py-2 text-xs xl:px-4"
            >
              {dict.nav.login}
            </Button>

            <Button
              href="/dons"
              className="whitespace-nowrap px-3 py-2 text-xs xl:px-4"
            >
              {dict.nav.donations}
            </Button>
          </div>

          {/* ============================================================
              MOBILE BUTTON
          ============================================================ */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-royal-100 bg-paper-light text-royal transition hover:bg-royal-50 lg:hidden"
            aria-label={
              mobileOpen
                ? "Fermer le menu"
                : "Ouvrir le menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="clg-mobile-menu"
          >
            <div className="flex w-5 flex-col gap-1.5">
              <span
                className={[
                  "h-0.5 w-full rounded-full bg-current transition-all duration-300",
                  mobileOpen
                    ? "translate-y-2 rotate-45"
                    : "",
                ].join(" ")}
              />

              <span
                className={[
                  "h-0.5 w-full rounded-full bg-current transition-all duration-200",
                  mobileOpen ? "opacity-0" : "",
                ].join(" ")}
              />

              <span
                className={[
                  "h-0.5 w-full rounded-full bg-current transition-all duration-300",
                  mobileOpen
                    ? "-translate-y-2 -rotate-45"
                    : "",
                ].join(" ")}
              />
            </div>
          </button>
        </div>
      </Container>

      {/* ================================================================
          MOBILE MENU
      ================================================================= */}
      <div
        id="clg-mobile-menu"
        className={[
          "overflow-hidden border-t border-royal-100 bg-paper-light transition-all duration-300 lg:hidden",
          mobileOpen
            ? "max-h-[calc(100vh-64px)] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        ].join(" ")}
      >
        <Container>
          <nav
            className="max-h-[calc(100vh-64px)] overflow-y-auto py-3 sm:py-4"
            aria-label="Navigation mobile"
          >
            <div className="grid grid-cols-1 gap-1">
              {navKeys.map((key) => {
                const href = navHrefs[key];
                const active = isActive(href);

                return (
                  <Link
                    key={key}
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex min-h-11 items-center rounded-lg px-4",
                      "text-sm font-medium",
                      "transition-colors",
                      active
                        ? "bg-royal-50 text-royal"
                        : "text-slate hover:bg-royal-50 hover:text-royal",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mr-3 h-1.5 w-1.5 rounded-full",
                        active ? "bg-crimson" : "bg-transparent",
                      ].join(" ")}
                    />

                    {dict.nav[key]}
                  </Link>
                );
              })}
            </div>

            {/* Mobile actions */}
            <div className="mt-3 grid grid-cols-1 gap-2 border-t border-royal-100 pt-3 sm:grid-cols-2">
              <Button
                href="/login"
                variant="secondary"
                onClick={closeMenu}
                className="w-full py-2.5 text-xs"
              >
                {dict.nav.login}
              </Button>

              <Button
                href="/dons"
                onClick={closeMenu}
                className="w-full py-2.5 text-xs"
              >
                {dict.nav.donations}
              </Button>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}