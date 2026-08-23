import { cn } from "@/lib/utils/cn";

type Accent = "royal" | "crimson" | "gold";

const accentClasses: Record<Accent, { bar: string; text: string; badge: string }> = {
  royal: {
    bar: "bg-gradient-to-b from-royal via-royal-500 to-royal-900",
    text: "text-royal",
    badge: "bg-royal-50",
  },
  crimson: {
    bar: "bg-gradient-to-b from-crimson via-crimson-300 to-crimson-700",
    text: "text-crimson",
    badge: "bg-crimson-100",
  },
  gold: {
    bar: "bg-gradient-to-b from-gold via-gold-300 to-gold-700",
    text: "text-gold-700",
    badge: "bg-gold-100",
  },
};

export function ObjectiveCard({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: Accent;
}) {
  const classes = accentClasses[accent];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-royal-100 bg-paper-light p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-royal-300 hover:shadow-lg hover:shadow-royal-100/60">
      {/* Barre d'accent supérieure */}
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", classes.bar)} />

      <div className="flex items-center justify-between gap-3">
        <p className={cn("font-mono text-xs uppercase tracking-[0.15em]", classes.text)}>
          {label}
        </p>

        <span
          aria-hidden="true"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-bold transition-transform duration-300 group-hover:scale-110",
            classes.badge,
            classes.text
          )}
        >
          ●
        </span>
      </div>

      <p className="mt-4 font-body text-sm leading-relaxed text-charcoal">{text}</p>
    </article>
  );
}