export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

let webglSupport: boolean | null = null;

/** Detects whether the browser can create a WebGL context. Cached after first call. */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (webglSupport !== null) return webglSupport;
  if (new URLSearchParams(window.location.search).has("no3d")) {
    webglSupport = false;
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    webglSupport = !!ctx;
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

export function isSmallScreen(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "history", label: "History" },
  { id: "about", label: "About" },
  { id: "parts", label: "Parts" },
  { id: "types", label: "Types" },
  { id: "stadium", label: "Stadium" },
  { id: "collection", label: "Collection" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
