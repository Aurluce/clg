import { cn } from "@/lib/utils/cn";

export function ConceptCard({
  index,
  title,
  text,
  accent,
}: {
  index?: string;
  title: string;
  text: string;
  accent: "royal" | "crimson";
}) {
  const isRoyal = accent === "royal";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-paper-light p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        isRoyal
          ? "border-royal-100 hover:border-royal-300 hover:shadow-royal-100/60"
          : "border-crimson-100 hover:border-crimson-300 hover:shadow-crimson-100/60"
      )}
    >
      {/* Numéro fantôme en arrière-plan */}
      {index && (
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -right-3 -top-6 select-none font-display text-[7rem] font-bold leading-none opacity-[0.07]",
            isRoyal ? "text-royal" : "text-crimson"
          )}
        >
          {index}
        </span>
      )}

      {/* Barre d'accent latérale */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-1 transition-all duration-300 group-hover:w-1.5",
          isRoyal
            ? "bg-gradient-to-b from-royal via-royal-500 to-royal-900"
            : "bg-gradient-to-b from-crimson via-crimson-300 to-crimson-700"
        )}
      />

      <div className="relative pl-3">
        <h3 className="font-display text-xl font-semibold leading-snug text-royal md:text-2xl">
          {title}
        </h3>

        <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-slate md:text-base">
          {text}
        </p>
      </div>
    </article>
  );
}