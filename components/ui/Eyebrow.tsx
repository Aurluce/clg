import { cn } from "@/lib/utils/cn";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs uppercase tracking-[0.2em] text-crimson animate-fade-in", className)}>
      {children}
    </p>
  );
}