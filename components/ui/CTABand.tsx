import Link from "next/link";
import { Container } from "./Container";

export function CTABand({
  eyebrow,
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-royal">
      {/* Calques décoratifs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-royal-500/40 blur-3xl" />
        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div className="bg-dots-lg absolute inset-0 text-paper opacity-[0.07]" />
      </div>

      <Container className="relative py-16 md:py-20">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              {eyebrow}
            </p>

            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-paper md:text-4xl">
              {title}
            </h2>

            {text && (
              <p className="mt-4 font-body text-sm leading-relaxed text-royal-100 md:text-base">
                {text}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-crimson px-6 py-3 font-body text-sm font-medium tracking-wide text-paper no-underline transition-all duration-200 hover:bg-crimson-700 hover:scale-[1.03]"
            >
              {primaryLabel}
              <span aria-hidden="true">→</span>
            </Link>

            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-paper/40 px-6 py-3 font-body text-sm font-medium tracking-wide text-paper no-underline transition-all duration-200 hover:border-paper hover:bg-paper hover:text-royal"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}