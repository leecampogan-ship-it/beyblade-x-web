import { cn } from "@/lib/utils";

/** Original "BEYBLADE X" wordmark (custom type treatment — not the official trademark artwork). */
export default function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <span className={cn("headline text-3xl text-cream", className)}>
        B<span className="neon">X</span>
      </span>
    );
  }
  return (
    <span className={cn("headline text-[1.35rem] font-extrabold leading-none tracking-tight text-cream", className)}>
      Beyblade<span className="neon"> X</span>
    </span>
  );
}
