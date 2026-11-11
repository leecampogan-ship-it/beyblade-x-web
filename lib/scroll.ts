import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Scrolls via Lenis when smooth scrolling is active (keeps it in sync), otherwise natively. */
export function smoothScrollTo(target: number | HTMLElement | null) {
  if (target === null) return;
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === "number" ? 0 : -64 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth" });
}
