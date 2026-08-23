import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/utils/cn";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-royal-100 bg-paper-light",
        className
      )}
    >
      {/* Calques décoratifs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-royal-100/70 blur-3xl" />
        <div className="absolute -bottom-44 -left-28 h-80 w-80 rounded-full bg-gold-100/60 blur-3xl" />
        <div className="bg-dots absolute inset-0 text-royal-300 opacity-30 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_72%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
        <Eyebrow>{eyebrow}</Eyebrow>

        <h1 className="fade-up mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-royal md:text-[3.4rem]">
          {title}
        </h1>

        {subtitle && (
          <p className="fade-up fade-up-1 mt-5 max-w-2xl font-body text-base leading-relaxed text-slate md:text-lg">
            {subtitle}
          </p>
        )}

        {children && (
          <div className="fade-up fade-up-2 mt-8">{children}</div>
        )}
      </div>

      {/* Fil d'or de clôture */}
      <div aria-hidden="true" className="world-thread absolute bottom-0 left-0 right-0" />
    </section>
  );
}