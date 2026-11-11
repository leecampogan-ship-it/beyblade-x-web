"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { Combine, Split, MousePointerClick } from "lucide-react";
import SectionHeading from "./SectionHeading";
import SceneShell from "./three/SceneShell";
import SceneLoader from "./three/SceneLoader";
import BeyIllustration from "./BeyIllustration";
import type { PartId } from "./three/BeybladeModel";
import { BIT_GLOSSARY, PRODUCTS, type Product } from "@/lib/products";
import { TYPE_BY_ID } from "@/lib/beyTypes";
import { cn } from "@/lib/utils";

const ExplodedView = dynamic(() => import("./three/ExplodedView"), {
  ssr: false,
  loading: () => <SceneLoader label="Assembling model" />,
});

const SHOWCASE = PRODUCTS.filter((p) =>
  ["sword-dran-3-60f", "arrow-wizard-4-80b", "scythe-incendio-4-60t", "helm-knight-3-80n"].includes(p.id),
);

interface PartInfo {
  id: PartId;
  name: string;
  position: string;
  purpose: string;
  points: { title: string; text: string }[];
}

const PARTS: PartInfo[] = [
  {
    id: "blade",
    name: "Blade",
    position: "Top component",
    purpose:
      "The Blade is the upper, outermost part — the part that actually strikes the opponent. Its metal-reinforced outline defines how a Beyblade attacks, defends and stores spinning energy.",
    points: [
      {
        title: "Contact points",
        text: "The protruding edges that hit the opponent. Sharp, steep contact points deliver smash attacks; rounded ones deflect hits.",
      },
      {
        title: "Shape & design",
        text: "Aggressive saw-tooth shapes favour Attack, smooth circular outlines favour Stamina, and thick rounded shields favour Defense.",
      },
      {
        title: "Weight distribution",
        text: "Weight placed at the outer edge increases centrifugal force and spin time; weight near the centre improves stability.",
      },
      {
        title: "Attack potential",
        text: "More pronounced contact points transfer more force on impact, raising the chance of Xtreme and Over Finishes.",
      },
      {
        title: "Defensive characteristics",
        text: "Smooth, sloped surfaces redirect incoming hits, reducing recoil and protecting against bursts.",
      },
    ],
  },
  {
    id: "ratchet",
    name: "Ratchet",
    position: "Middle component",
    purpose:
      "The Ratchet locks the Blade and Bit together and sets the Beyblade's height. Its name is a code: “3-60” means 3 protrusions and a height of 6.0 mm.",
    points: [
      {
        title: "Height",
        text: "The second number (60, 80…) is the height in tenths of a millimetre. Lower ratchets keep the Blade low; higher ratchets lift it to change where it makes contact.",
      },
      {
        title: "Protrusions",
        text: "The first number is how many protrusions stick out from the Ratchet. These shape its outline and how it interacts with opponents.",
      },
      {
        title: "Locking & bursts",
        text: "The Ratchet's teeth hold the parts together. Hard hits can turn the Blade until it releases — causing a Burst Finish.",
      },
      {
        title: "Customisation",
        text: "Swapping Ratchets is the easiest way to fine-tune a combo's height and balance without changing its overall type.",
      },
    ],
  },
  {
    id: "bit",
    name: "Bit",
    position: "Bottom component",
    purpose:
      "The Bit is the tip that touches the stadium floor. It controls how the Beyblade moves, and its gear teeth engage the X-Celerator Rail for Xtreme Dashes.",
    points: [
      {
        title: "Stadium contact",
        text: "The size and shape of the tip decide how much friction it has with the floor — the single biggest influence on movement.",
      },
      {
        title: "Movement & speed",
        text: "Wide, flat tips grip the floor and race around aggressively. Sharp tips barely move.",
      },
      {
        title: "Stability",
        text: "Needle-style tips stay rooted in one spot, making the Beyblade harder to push out.",
      },
      {
        title: "Stamina",
        text: "Low-friction tips such as Ball lose less energy, so the Beyblade spins for longer.",
      },
      {
        title: "Rail engagement",
        text: "The gear around the tip meshes with the rail. Gear Flat bits are designed to grip it especially well.",
      },
    ],
  },
];

function PartIcon({ part, product }: { part: PartId; product: Product }) {
  const v = product.visual;
  if (part === "blade") return <BeyIllustration visual={v} className="h-24 w-24" />;
  if (part === "ratchet") {
    return (
      <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
        <circle cx="50" cy="50" r="30" fill="#2b2f36" stroke="#5c6575" strokeWidth="2" />
        {Array.from({ length: v.ratchetProtrusions }).map((_, i) => {
          const a = (i / v.ratchetProtrusions) * 360;
          return <rect key={i} x="44" y="10" width="12" height="16" fill="#3d434d" stroke="#6b7586" transform={`rotate(${a} 50 50)`} />;
        })}
        <circle cx="50" cy="50" r="16" fill="none" stroke={v.accent} strokeWidth="3" />
        <text x="50" y="54" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="var(--font-display)">
          {product.ratchet}
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden>
      <rect x="22" y="14" width="56" height="20" rx="4" fill={v.primary} />
      <g fill="#c9ced6">
        {[26, 34, 42, 50, 58, 66].map((x) => (
          <rect key={x} x={x} y="36" width="5" height="8" />
        ))}
      </g>
      <rect x="28" y="34" width="44" height="8" fill="#c9ced6" />
      {v.bit === "ball" ? (
        <path d="M32 44 H68 A18 18 0 0 1 32 44 Z" fill="#e9edf2" />
      ) : v.bit === "needle" || v.bit === "highneedle" ? (
        <path d={`M32 44 H68 L51 ${v.bit === "highneedle" ? 94 : 86} H49 Z`} fill="#e9edf2" />
      ) : v.bit === "taper" ? (
        <path d="M32 44 H68 L58 78 H42 Z" fill="#e9edf2" />
      ) : (
        <path d="M32 44 H68 L64 74 H36 Z" fill="#e9edf2" />
      )}
      <text x="50" y="28" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="var(--font-display)">
        {product.bitCode}
      </text>
    </svg>
  );
}

export default function PartsBreakdown() {
  const [exploded, setExploded] = useState(true);
  const [selected, setSelected] = useState<PartId | null>(null);
  const [productId, setProductId] = useState(SHOWCASE[0].id);
  const product = SHOWCASE.find((p) => p.id === productId) ?? SHOWCASE[0];
  const info = PARTS.find((p) => p.id === (selected ?? "blade"))!;
  const type = TYPE_BY_ID[product.type];

  const select = (p: PartId | null) => {
    setSelected(p);
    if (p) setExploded(true);
  };

  const specific: Record<PartId, string> = {
    blade: `${product.blade} — ${type.name} type blade with ${product.visual.contactPoints} main contact points.`,
    ratchet: `${product.ratchet}: ${product.visual.ratchetProtrusions} protrusions, ${(product.visual.ratchetHeight).toFixed(1)} mm height.`,
    bit: `${product.bit} (${product.bitCode}) — ${BIT_GLOSSARY[product.bitCode]?.summary ?? ""}`,
  };

  return (
    <section id="parts" className="relative overflow-hidden bg-charcoal py-24 sm:py-32">
      <span aria-hidden className="headline text-outline pointer-events-none absolute -left-6 bottom-10 select-none text-[24vw] text-white/[0.04]">
        B·R·B
      </span>

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10">
        <SectionHeading
            index="03"
          eyebrow="Interactive 3D breakdown"
          title="Blade. Ratchet."
          accent="Bit."
          description="Every Beyblade X is built from three parts. Rotate the model, separate it into its components and click each part to learn what it does."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* Viewer */}
          <div className="relative flex flex-col self-start overflow-hidden rounded-2xl bg-steel lg:sticky lg:top-20">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex gap-2" role="group" aria-label="Assembly controls">
                <button
                  type="button"
                  onClick={() => {
                    setExploded(false);
                    setSelected(null);
                  }}
                  aria-pressed={!exploded}
                  className={cn(
                    "label inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors",
                    !exploded ? "bg-cream text-ink" : "border border-cream/20 text-cream/70 hover:text-cream",
                  )}
                >
                  <Combine size={16} /> Assemble
                </button>
                <button
                  type="button"
                  onClick={() => setExploded(true)}
                  aria-pressed={exploded}
                  className={cn(
                    "label inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors",
                    exploded ? "bg-accent text-ink" : "border border-cream/20 text-cream/70 hover:text-cream",
                  )}
                >
                  <Split size={16} /> Separate
                </button>
              </div>
              <label className="flex items-center gap-2 text-xs text-white/50">
                <span className="sr-only sm:not-sr-only">Model</span>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="label rounded-full border border-cream/20 bg-steel px-3 py-2.5 text-cream"
                >
                  {SHOWCASE.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.config}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="relative h-[420px] sm:h-[520px]">
              <SceneShell
                fallback={
                  <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
                    <div className="flex items-end gap-6">
                      {PARTS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => select(p.id)}
                          className={cn("flex flex-col items-center gap-2 p-2", selected === p.id && "ring-2 ring-accent")}
                        >
                          <PartIcon part={p.id} product={product} />
                          <span className="font-display text-sm tracking-widest">{p.name.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-center text-xs text-white/50">3D view unavailable — showing part illustrations.</p>
                  </div>
                }
              >
                {(active) => (
                  <ExplodedView
                    active={active}
                    visual={product.visual}
                    exploded={exploded}
                    selected={selected}
                    onSelect={select}
                  />
                )}
              </SceneShell>
              <p className="label pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 text-cream/45">
                <MousePointerClick size={14} /> Click a part · drag to rotate
              </p>
            </div>

            {/* Part quick-select */}
            <div className="grid grid-cols-3 border-t border-dashed border-cream/15" role="tablist" aria-label="Select a part">
              {PARTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={selected === p.id}
                  onClick={() => select(p.id)}
                  className={cn(
                    "label relative py-4 transition-colors",
                    selected === p.id ? "text-accent" : "text-cream/50 hover:text-cream",
                  )}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Info panel */}
          <div className="relative" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.article
                key={info.id + product.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                className="h-full rounded-2xl border border-cream/10 p-6 sm:p-10"
              >
                {!selected && (
                  <p className="eyebrow mb-6">
                    Tip: click a part in the 3D model
                  </p>
                )}
                <div className="flex items-center gap-5">
                  <div className="grid h-28 w-28 shrink-0 place-items-center rounded-2xl bg-steel">
                    <PartIcon part={info.id} product={product} />
                  </div>
                  <div>
                    <p className="label text-cream/50">{info.position}</p>
                    <h3 className="headline mt-1 text-6xl text-cream">{info.name}</h3>
                    <p className="mt-2 text-sm text-cream/50">
                      on {product.name} {product.config}
                    </p>
                  </div>
                </div>
                <p className="mt-8 font-display text-xl font-medium leading-snug text-cream">{info.purpose}</p>
                <p className="mt-5 border-l border-accent pl-4 text-base text-cream/75">
                  {specific[info.id]}
                </p>
                <dl className="mt-8 space-y-5 border-t border-dashed border-cream/15 pt-7">
                  {info.points.map((pt) => (
                    <div key={pt.title}>
                      <dt className="label text-cream">{pt.title}</dt>
                      <dd className="mt-1.5 text-base leading-relaxed text-cream/60">{pt.text}</dd>
                    </div>
                  ))}
                </dl>
                {info.id === "bit" && (
                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {Object.entries(BIT_GLOSSARY).map(([code, b]) => (
                      <div
                        key={code}
                        className={cn(
                          "rounded-full border px-3 py-2",
                          code === product.bitCode ? "border-accent text-accent" : "border-cream/15 text-cream/70",
                        )}
                        title={b.summary}
                      >
                        <span className="font-display text-base font-semibold">{code}</span>
                        <span className="ml-2 text-sm opacity-70">{b.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
