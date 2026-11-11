import type { BeyVisual, BitShape, PerformanceType } from "./types";

/**
 * Beyblade X product catalogue.
 *
 * Names, configurations and performance types follow the Hasbro (English-language)
 * releases and were checked against Hasbro / retailer listings. Fields that could not
 * be verified are intentionally omitted rather than invented.
 *
 * To add a product: append an entry to PRODUCTS. `image` is optional — when omitted
 * the card renders an original procedural illustration generated from `visual`.
 * Product photography is from the official site https://beyblade.com/ (© Takara Tomy / Hasbro);
 * see ASSETS.md. Photos live in /public/images/beyblades/ (transparent top views) and
 * /public/images/beyblades/packaging/.
 */
export interface Product {
  id: string;
  name: string;
  /** Full configuration string e.g. "3-60F". */
  config: string;
  type: PerformanceType;
  blade: string;
  ratchet: string;
  bit: string;
  bitCode: string;
  spin: "Right" | "Left";
  /** Retail format and release information (only verified details). */
  release: string;
  /** Takara Tomy (Japanese) equivalent where confidently known. */
  takaraEquivalent?: string;
  description: string;
  /** Transparent top-down product photo. */
  image?: string;
  /** Retail packaging photo. */
  packaging?: string;
  visual: BeyVisual;
}

export const BIT_GLOSSARY: Record<string, { name: string; shape: BitShape; summary: string }> = {
  F: {
    name: "Flat",
    shape: "flat",
    summary:
      "A wide, flat tip with lots of grip. It moves fast and aggressively and easily catches the X-Celerator Rail.",
  },
  B: {
    name: "Ball",
    shape: "ball",
    summary:
      "A rounded tip that rolls smoothly with low friction, favouring stamina and stable, controlled movement.",
  },
  T: {
    name: "Taper",
    shape: "taper",
    summary:
      "A tapered tip with a small flat point — it stays calm in the centre but can move out to attack when tilted.",
  },
  N: {
    name: "Needle",
    shape: "needle",
    summary:
      "A sharp point with minimal contact area. It stays put and resists being pushed, ideal for defense and stamina.",
  },
  GF: {
    name: "Gear Flat",
    shape: "gearflat",
    summary:
      "A flat tip surrounded by gear teeth, built to grip the X-Celerator Rail for powerful Xtreme Dashes.",
  },
  HN: {
    name: "High Needle",
    shape: "highneedle",
    summary: "A taller version of Needle that raises the whole Beyblade for a different contact height.",
  },
};

export const PRODUCTS: Product[] = [
  {
    id: "sword-dran-3-60f",
    name: "Sword Dran",
    config: "3-60F",
    type: "attack",
    blade: "Sword Dran",
    ratchet: "3-60",
    bit: "Flat",
    bitCode: "F",
    spin: "Right",
    release: "Hasbro Starter Pack (Wave 1)",
    takaraEquivalent: "Dran Sword 3-60F (BX-01)",
    description:
      "The iconic first Beyblade X top. Three sword-like contact points deliver heavy hits, while the Flat bit grips the X-Celerator Rail for explosive Xtreme Dashes.",
    image: "/images/beyblades/sword-dran-3-60f.webp",
    packaging: "/images/beyblades/packaging/sword-dran-3-60f.webp",
    visual: {
      image: "/images/beyblades/sword-dran-3-60f.webp",
      bladeStyle: "attack",
      contactPoints: 3,
      primary: "#1e6bff",
      secondary: "#c9d3e0",
      accent: "#ffd23d",
      ratchetProtrusions: 3,
      ratchetHeight: 6,
      bit: "flat",
    },
  },
  {
    id: "arrow-wizard-4-80b",
    name: "Arrow Wizard",
    config: "4-80B",
    type: "stamina",
    blade: "Arrow Wizard",
    ratchet: "4-80",
    bit: "Ball",
    bitCode: "B",
    spin: "Right",
    release: "Hasbro Starter Pack (Wave 1)",
    takaraEquivalent: "Wizard Arrow 4-80B (BX-03)",
    description:
      "A wide, smooth blade generates strong centrifugal force so it keeps spinning and outlasts opponents. The Ball bit rolls with minimal friction.",
    image: "/images/beyblades/arrow-wizard-4-80b.webp",
    packaging: "/images/beyblades/packaging/arrow-wizard-4-80b.webp",
    visual: {
      image: "/images/beyblades/arrow-wizard-4-80b.webp",
      bladeStyle: "stamina",
      contactPoints: 4,
      primary: "#f2c94c",
      secondary: "#e8ecf2",
      accent: "#7c4dff",
      ratchetProtrusions: 4,
      ratchetHeight: 8,
      bit: "ball",
    },
  },
  {
    id: "scythe-incendio-4-60t",
    name: "Scythe Incendio",
    config: "4-60T",
    type: "balance",
    blade: "Scythe Incendio",
    ratchet: "4-60",
    bit: "Taper",
    bitCode: "T",
    spin: "Right",
    release: "Hasbro Starter Pack (Wave 1)",
    takaraEquivalent: "Hells Scythe 4-60T (BX-02)",
    description:
      "A versatile Balance type. Its curved scythe-shaped blades and Taper bit balance early attack power with endurance.",
    image: "/images/beyblades/scythe-incendio-4-60t.webp",
    packaging: "/images/beyblades/packaging/scythe-incendio-4-60t.webp",
    visual: {
      image: "/images/beyblades/scythe-incendio-4-60t.webp",
      bladeStyle: "balance",
      contactPoints: 4,
      primary: "#d7263d",
      secondary: "#2a2d34",
      accent: "#ff8a3d",
      ratchetProtrusions: 4,
      ratchetHeight: 6,
      bit: "taper",
    },
  },
  {
    id: "helm-knight-3-80n",
    name: "Helm Knight",
    config: "3-80N",
    type: "defense",
    blade: "Helm Knight",
    ratchet: "3-80",
    bit: "Needle",
    bitCode: "N",
    spin: "Right",
    release: "Hasbro Starter Pack (Wave 1)",
    takaraEquivalent: "Knight Shield 3-80N (BX-04)",
    description:
      "A shield-like blade designed to dampen incoming attacks, paired with a Needle bit that holds its position in the centre of the stadium.",
    image: "/images/beyblades/helm-knight-3-80n.webp",
    packaging: "/images/beyblades/packaging/helm-knight-3-80n.webp",
    visual: {
      image: "/images/beyblades/helm-knight-3-80n.webp",
      bladeStyle: "defense",
      contactPoints: 3,
      primary: "#2fb36b",
      secondary: "#d9dee6",
      accent: "#1e6bff",
      ratchetProtrusions: 3,
      ratchetHeight: 8,
      bit: "needle",
    },
  },
  {
    id: "soar-phoenix-9-60gf",
    name: "Soar Phoenix",
    config: "9-60GF",
    type: "attack",
    blade: "Soar Phoenix",
    ratchet: "9-60",
    bit: "Gear Flat",
    bitCode: "GF",
    spin: "Right",
    release: "Hasbro Deluxe String Launcher Set",
    takaraEquivalent: "Phoenix Wing 9-60GF (BX-23)",
    description:
      "A wing-shaped Attack type with a nine-protrusion ratchet. The Gear Flat bit locks onto the rail for aggressive Xtreme Dashes.",
    image: "/images/beyblades/soar-phoenix-9-60gf.webp",
    packaging: "/images/beyblades/packaging/soar-phoenix-9-60gf.webp",
    visual: {
      image: "/images/beyblades/soar-phoenix-9-60gf.webp",
      bladeStyle: "attack",
      contactPoints: 3,
      primary: "#e63946",
      secondary: "#ffb703",
      accent: "#fff3c4",
      ratchetProtrusions: 9,
      ratchetHeight: 6,
      bit: "gearflat",
    },
  },
  {
    id: "steel-samurai-4-80t",
    name: "Steel Samurai",
    config: "4-80T",
    type: "balance",
    blade: "Steel Samurai",
    ratchet: "4-80",
    bit: "Taper",
    bitCode: "T",
    spin: "Right",
    release: "Hasbro Booster Pack",
    description:
      "A balanced warrior ready for any battle strategy. The Taper bit lets it switch between holding the centre and moving in to attack.",
    image: "/images/beyblades/steel-samurai-4-80t.webp",
    packaging: "/images/beyblades/packaging/steel-samurai-4-80t.webp",
    visual: {
      image: "/images/beyblades/steel-samurai-4-80t.webp",
      bladeStyle: "balance",
      contactPoints: 4,
      primary: "#d7263d",
      secondary: "#e5e9f0",
      accent: "#d7263d",
      ratchetProtrusions: 4,
      ratchetHeight: 8,
      bit: "taper",
    },
  },
  {
    id: "talon-ptera-3-80b",
    name: "Talon Ptera",
    config: "3-80B",
    type: "stamina",
    blade: "Talon Ptera",
    ratchet: "3-80",
    bit: "Ball",
    bitCode: "B",
    spin: "Right",
    release: "Hasbro Booster Pack",
    description:
      "A stamina specialist built to outlast the competition, with talon-like wings and a smooth-rolling Ball bit.",
    image: "/images/beyblades/talon-ptera-3-80b.webp",
    packaging: "/images/beyblades/packaging/talon-ptera-3-80b.webp",
    visual: {
      image: "/images/beyblades/talon-ptera-3-80b.webp",
      bladeStyle: "stamina",
      contactPoints: 3,
      primary: "#ff7a1a",
      secondary: "#caf0f8",
      accent: "#ff6b35",
      ratchetProtrusions: 3,
      ratchetHeight: 8,
      bit: "ball",
    },
  },
  {
    id: "knife-shinobi-4-80hn",
    name: "Knife Shinobi",
    config: "4-80HN",
    type: "defense",
    blade: "Knife Shinobi",
    ratchet: "4-80",
    bit: "High Needle",
    bitCode: "HN",
    spin: "Right",
    release: "Hasbro Dual Pack (with Keel Shark 3-80F)",
    description:
      "A Defense type that maintains a strong, stable centre of gravity. The High Needle bit keeps it planted against incoming attacks.",
    image: "/images/beyblades/knife-shinobi-4-80hn.webp",
    packaging: "/images/beyblades/packaging/knife-shinobi-keel-shark-dual-pack.webp",
    visual: {
      image: "/images/beyblades/knife-shinobi-4-80hn.webp",
      bladeStyle: "defense",
      contactPoints: 4,
      primary: "#3a0ca3",
      secondary: "#b8c0cc",
      accent: "#4cc9f0",
      ratchetProtrusions: 4,
      ratchetHeight: 8,
      bit: "highneedle",
    },
  },
  {
    id: "keel-shark-3-80f",
    name: "Keel Shark",
    config: "3-80F",
    type: "attack",
    blade: "Keel Shark",
    ratchet: "3-80",
    bit: "Flat",
    bitCode: "F",
    spin: "Right",
    release: "Hasbro Dual Pack (with Knife Shinobi 4-80HN)",
    description:
      "A shark-inspired Attack type that excels at low-position attacks, using a Flat bit for fast, aggressive movement around the rail.",
    image: "/images/beyblades/keel-shark-3-80f.webp",
    packaging: "/images/beyblades/packaging/knife-shinobi-keel-shark-dual-pack.webp",
    visual: {
      image: "/images/beyblades/keel-shark-3-80f.webp",
      bladeStyle: "attack",
      contactPoints: 3,
      primary: "#3ecf4a",
      secondary: "#90e0ef",
      accent: "#f72585",
      ratchetProtrusions: 3,
      ratchetHeight: 8,
      bit: "flat",
    },
  },
];
