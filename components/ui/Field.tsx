import { cn } from "@/lib/utils/cn";

export const inputClassName =
  "mt-2 w-full rounded-md border border-royal-100 bg-paper px-4 py-3 font-body text-sm text-charcoal shadow-sm transition-colors placeholder:text-slate-light hover:border-royal-300 focus:border-royal focus:outline-none focus:ring-4 focus:ring-royal-100";

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("block", className)}>
      <label className="font-body text-sm font-medium text-charcoal">
        {label}
        {required && (
          <span className="ml-0.5 text-crimson" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {hint && (
        <p className="mt-1.5 font-mono text-xs leading-relaxed text-slate-light">
          {hint}
        </p>
      )}
    </div>
  );
}