import { Eyebrow } from "./Eyebrow";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

      <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-royal md:text-4xl">
        {title}
      </h2>

      {lead && (
        <p className="mt-4 font-body text-base leading-relaxed text-slate">
          {lead}
        </p>
      )}
    </div>
  );
}