import type { BeyVisual, TypeInfo } from "./types";
import { PRODUCTS } from "./products";

/** Each type is illustrated with a real example Beyblade of that type. */
const visualOf = (id: string): BeyVisual => PRODUCTS.find((p) => p.id === id)!.visual;

export const TYPES: TypeInfo[] = [
  {
    id: "attack",
    name: "Attack",
    tagline: "Strike first. Strike hard.",
    color: "#ff2d55",
    glow: "rgba(255,45,85,0.45)",
    summary:
      "Attack types move fast and hit hard. Sharp contact points and grippy bits let them race around the stadium and smash opponents out.",
    traits: ["Aggressive movement", "Powerful hits", "High-speed dashes", "Aims for Xtreme & Over Finishes"],
    strengths: [
      "Can win quickly with Xtreme or Over Finishes",
      "Excellent at using the X-Celerator Rail",
      "Punishes slow, passive opponents",
    ],
    weaknesses: [
      "Burns stamina quickly",
      "Can self-KO by flying out of the stadium",
      "Struggles against heavy, well-anchored Defense types",
    ],
    strategy: [
      "Launch with a slight tilt to catch the rail early",
      "Use Flat or Gear Flat bits for maximum speed",
      "Finish the battle before your spin runs out",
    ],
    stats: { attack: 10, defense: 3, stamina: 3, speed: 10, burstResistance: 4 },
    visual: visualOf("sword-dran-3-60f"),
  },
  {
    id: "defense",
    name: "Defense",
    tagline: "Hold the line.",
    color: "#2fd67b",
    glow: "rgba(47,214,123,0.45)",
    summary:
      "Defense types are built to absorb punishment. Rounded, sturdy blades and stable bits deflect attacks and keep the top anchored in the centre.",
    traits: ["Impact resistance", "Stability", "Strong centre of gravity", "Survives aggressive opponents"],
    strengths: [
      "Hard to knock out of the stadium",
      "Deflects incoming attacks with rounded contact points",
      "Counters Attack types well",
    ],
    weaknesses: [
      "Little offensive power of its own",
      "Can lose Spin Finishes to Stamina types",
      "Vulnerable if knocked off-centre",
    ],
    strategy: [
      "Launch flat and gently to settle in the centre",
      "Use Needle or High Needle bits to hold position",
      "Let the attacker tire itself out",
    ],
    stats: { attack: 3, defense: 10, stamina: 6, speed: 2, burstResistance: 9 },
    visual: visualOf("helm-knight-3-80n"),
  },
  {
    id: "stamina",
    name: "Stamina",
    tagline: "Outlast everything.",
    color: "#ffb020",
    glow: "rgba(255,176,32,0.45)",
    summary:
      "Stamina types spin for as long as possible. Wide, smooth blades put weight on the outside and low-friction bits conserve every bit of energy.",
    traits: ["Extended spin time", "Efficient movement", "Energy conservation", "Wins by Spin Finish"],
    strengths: [
      "Outspins most opponents",
      "Smooth contact points shrug off glancing hits",
      "Very consistent in long battles",
    ],
    weaknesses: [
      "Vulnerable to strong Attack types early on",
      "Can be burst or knocked out by direct hits",
      "Rarely wins with big-point finishes",
    ],
    strategy: [
      "Launch with maximum power and a flat angle",
      "Use Ball or Needle bits to minimise friction",
      "Avoid contact and wait for the opponent to slow down",
    ],
    stats: { attack: 2, defense: 5, stamina: 10, speed: 4, burstResistance: 6 },
    visual: visualOf("arrow-wizard-4-80b"),
  },
  {
    id: "balance",
    name: "Balance",
    tagline: "Adapt and conquer.",
    color: "#a259ff",
    glow: "rgba(162,89,255,0.45)",
    summary:
      "Balance types blend the characteristics of the other three. They can attack, defend or outlast depending on launch and setup — the most versatile choice.",
    traits: ["Versatility", "Adaptability", "Mixed contact points", "Multiple strategies"],
    strengths: [
      "Can adapt to any opponent",
      "Unpredictable — hard to counter",
      "Great for experimenting with customisation",
    ],
    weaknesses: [
      "Doesn't excel in any single area",
      "Specialist types can beat it at their own game",
      "Performance depends heavily on the blader's skill",
    ],
    strategy: [
      "Read your opponent and choose an angle to match",
      "Use Taper bits to switch between calm and aggressive",
      "Swap ratchets to fine-tune height and contact",
    ],
    stats: { attack: 6, defense: 6, stamina: 6, speed: 6, burstResistance: 6 },
    visual: visualOf("scythe-incendio-4-60t"),
  },
];

export const TYPE_BY_ID = Object.fromEntries(TYPES.map((t) => [t.id, t])) as Record<
  TypeInfo["id"],
  TypeInfo
>;
