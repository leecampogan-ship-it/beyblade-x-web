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

/**
 * Locks page scrolling (for modals and overlays). Pauses Lenis too, because Lenis keeps
 * scrolling the window even when the body has `overflow: hidden`. Returns an unlock function.
 */
export function lockScroll(): () => void {
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  lenis?.stop();
  return () => {
    document.body.style.overflow = prev;
    lenis?.start();
  };
}
