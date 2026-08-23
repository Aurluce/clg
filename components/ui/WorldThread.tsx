import { cn } from "@/lib/utils/cn";

export function WorldThread({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)} aria-hidden="true">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
      <span className="world-thread flex-1" />
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
    </div>
  );
}