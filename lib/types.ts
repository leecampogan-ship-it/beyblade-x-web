export type PerformanceType = "attack" | "defense" | "stamina" | "balance";

export type BitShape = "flat" | "ball" | "taper" | "needle" | "gearflat" | "highneedle";

export type BladeStyle = "attack" | "defense" | "stamina" | "balance";

/** Parameters that drive the procedural 3D Beyblade model. */
export interface BeyVisual {
  bladeStyle: BladeStyle;
  /** Number of main contact points on the blade. */
  contactPoints: number;
  primary: string;
  secondary: string;
  accent: string;
  /** Ratchet protrusion count (first digit of e.g. "3-60"). */
  ratchetProtrusions: number;
  /** Ratchet height in mm (60 => 6.0). */
  ratchetHeight: number;
  bit: BitShape;
  /** Optional transparent top-down product photo, mapped onto the 3D blade and used in 2D views. */
  image?: string;
}

export interface TypeInfo {
  id: PerformanceType;
  name: string;
  tagline: string;
  color: string;
  glow: string;
  summary: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  strategy: string[];
  /** Relative stat profile (0-10) for the comparison chart. Illustrative, not official. */
  stats: { attack: number; defense: number; stamina: number; speed: number; burstResistance: number };
  visual: BeyVisual;
}
