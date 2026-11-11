/** Smoothstep between a and b. */
export const ss = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * Scroll timeline for the pinned story hero (p = 0–1 across the section).
 * Shared by the 3D scene and the HTML overlay so both stay in sync.
 *
 * 0.00–0.18  On the workbench, top-down
 * 0.20–0.42  Rises and tilts to show its thickness
 * 0.46–0.76  Separates into Blade / Ratchet / Bit
 * 0.74–0.88  Reassembles and rips at full speed
 * 0.88–1.00  Leaves the frame
 */
export const STORY = {
  tilt: (p: number) => ss(0.2, 0.42, p) * 1.12 - ss(0.74, 0.86, p) * 0.62,
  explode: (p: number) => ss(0.46, 0.58, p) - ss(0.68, 0.76, p),
  spin: (p: number, reduced: boolean) => (reduced ? 0.25 : 0.9) + (reduced ? 0 : ss(0.74, 0.82, p) * 22),
  scale: (p: number) =>
    1 + ss(0.2, 0.42, p) * 0.12 - (ss(0.43, 0.52, p) - ss(0.68, 0.76, p)) * 0.3 - ss(0.88, 1, p) * 0.35,
  /** Screen-vertical offset (positive = down) so the exploded stack stays centred. */
  shift: (p: number) => (ss(0.43, 0.52, p) - ss(0.68, 0.76, p)) * 0.75,
  lift: (p: number) => ss(0.88, 1, p) * 1.6,
};
