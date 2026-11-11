import type { BladeStyle } from "./types";

/**
 * Polar radius function describing a blade outline (unit radius ≈ 1).
 * Shared by the 3D model and the 2D SVG illustrations so both match.
 */
export function bladeRadius(style: BladeStyle, points: number, theta: number): number {
  const t = ((((theta * points) / (Math.PI * 2)) % 1) + 1) % 1;
  switch (style) {
    case "attack": {
      // Sharp, sword-like sawtooth contact points
      const rise = t < 0.72 ? t / 0.72 : (1 - t) / 0.28;
      return 0.74 + 0.28 * Math.pow(rise, 2.2);
    }
    case "defense":
      // Rounded, shield-like lobes with small serrations
      return 0.9 + 0.06 * Math.cos(t * Math.PI * 2) + 0.012 * Math.cos(t * Math.PI * 12);
    case "stamina":
      // Wide, near-circular rim for centrifugal force
      return 0.97 + 0.035 * Math.cos(t * Math.PI * 2);
    case "balance":
    default: {
      // Mixed: curved hooks plus rounded mass
      const hook = t < 0.6 ? Math.sin((t / 0.6) * Math.PI * 0.5) : Math.cos(((t - 0.6) / 0.4) * Math.PI * 0.5);
      return 0.8 + 0.18 * Math.pow(hook, 1.6);
    }
  }
}

/** Builds an SVG path for a blade outline centred at (cx, cy). */
export function bladePath(style: BladeStyle, points: number, scale: number, cx = 0, cy = 0, segments = 180): string {
  let d = "";
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const r = bladeRadius(style, points, theta) * scale;
    const x = (cx + Math.cos(theta) * r).toFixed(2);
    const y = (cy + Math.sin(theta) * r).toFixed(2);
    d += `${i === 0 ? "M" : "L"}${x} ${y}`;
  }
  return d + "Z";
}
