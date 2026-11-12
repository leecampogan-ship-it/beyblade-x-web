export interface Generation {
  id: string;
  index: string;
  name: string;
  era: string;
  tagline: string;
  color: string;
  image: string;
  imageAlt: string;
  /** Optional transparent product photo shown as the card's feature image instead of the drawn top. */
  photo?: string;
  description: string;
  innovations: string[];
  series: string[];
  highlight?: boolean;
}

/**
 * Release years refer to the original Japanese (Takara Tomy) launches.
 * Western releases generally followed a year or more later.
 */
export const GENERATIONS: Generation[] = [
  {
    id: "bakuten",
    index: "01",
    name: "Bakuten Shoot Beyblade",
    era: "1999 – 2005",
    tagline: "Where it all began",
    color: "#f4a261",
    image: "/images/backgrounds/gen1-plastic.svg",
    photo: "/images/history/bakuten-dragoon.webp",
    imageAlt: "Dragoon, a Bakuten Shoot era Beyblade with a white and red attack ring",
    description:
      "Takara launched Beyblade in 1999, re-imagining the traditional spinning top (beigoma) as a customisable battle toy fired from a launcher. The 2001 anime followed Tyson and the Bladebreakers and turned Beyblade into a worldwide craze, building a global community of bladers and tournaments.",
    innovations: [
      "Launcher and ripcord system for powerful, consistent launches",
      "Swappable parts: Bit-Chip, Attack Ring, Weight Disk and Blade Base",
      "First dedicated battle stadiums (BeyStadiums)",
      "Later sub-systems such as Engine Gear and the Heavy Metal System",
    ],
    series: ["Beyblade (2001)", "Beyblade V-Force (2002)", "Beyblade G-Revolution (2003)"],
  },
  {
    id: "metal",
    index: "02",
    name: "Metal Fight Beyblade",
    era: "2008 – 2012",
    tagline: "The metal revolution",
    color: "#adb5bd",
    image: "/images/backgrounds/gen2-metal.svg",
    photo: "/images/history/metal-fight-l-drago.webp",
    imageAlt: "L-Drago, a Metal Fight Beyblade with a clear energy ring and a heavy metal fusion wheel",
    description:
      "The second generation replaced the plastic attack ring with a heavy metal Fusion Wheel. The added weight made impacts harder and battles faster, and the Metal Saga anime brought Gingka and Pegasus to a new generation of fans.",
    innovations: [
      "Die-cast metal Fusion Wheels for heavier, harder-hitting tops",
      "Face Bolt, Energy Ring, Fusion Wheel, Spin Track and Performance Tip construction",
      "Spin Track heights that changed contact points",
      "Later 4D System with multi-material wheels and mode changes",
    ],
    series: ["Metal Fusion", "Metal Masters", "Metal Fury", "Shogun Steel"],
  },
  {
    id: "burst",
    index: "03",
    name: "Beyblade Burst",
    era: "2015 – 2023",
    tagline: "Built to burst",
    color: "#7b2ff7",
    image: "/images/backgrounds/gen3-burst.svg",
    photo: "/images/history/burst-valkyrie.webp",
    imageAlt: "Valkyrie, a Beyblade Burst top with a blue, gold and red layer",
    description:
      "Burst introduced a spring-and-teeth locking mechanism: a strong hit could make a top fly apart, scoring a dramatic Burst Finish. Its Layer, Disc and Driver system made customisation deeper than ever across many sub-systems and a long-running anime.",
    innovations: [
      "The Burst system — tops can explode apart mid-battle",
      "Layer, Disc and Driver customisation",
      "Many sub-systems (e.g. Cho-Z, GT, Superking, DB, BU)",
      "Burst Finish added as a scoring condition in competitive play",
    ],
    series: ["Beyblade Burst", "Evolution", "Turbo", "Rise", "Surge", "QuadDrive", "QuadStrike"],
  },
  {
    id: "x",
    index: "04",
    name: "Beyblade X",
    era: "2023 – Present",
    tagline: "Accelerate your game",
    color: "#18d4ff",
    image: "/images/backgrounds/gen4-x.svg",
    imageAlt: "Illustration of a Beyblade X top dashing along the X-Celerator Rail",
    description:
      "Beyblade X launched in Japan in July 2023 and arrived worldwide via Hasbro in 2024. Its Xtreme Stadium features the X-Celerator Rail: gear-like bits grip the rail and fire the top forward in a high-speed Xtreme Dash. Battles are faster and more explosive than ever.",
    innovations: [
      "X-Celerator Rail and gear-equipped Bits for the Xtreme Dash",
      "Three-part Blade, Ratchet and Bit construction",
      "Xtreme Finish worth 3 points — knock opponents into the Xtreme Zone",
      "A modern competitive and online-connected scene",
    ],
    series: ["Beyblade X anime (2023)"],
    highlight: true,
  },
];
