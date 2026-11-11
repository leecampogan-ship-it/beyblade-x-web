"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, Swords, Shield, Timer, Scale, ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import SceneShell from "./three/SceneShell";
import SceneLoader from "./three/SceneLoader";
import BeyIllustration from "./BeyIllustration";
import { TYPES } from "@/lib/beyTypes";
import { PRODUCTS } from "@/lib/products";
import type { PerformanceType, TypeInfo } from "@/lib/types";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";
import { smoothScrollTo } from "@/lib/scroll";

const MiniBeyScene = dynamic(() => import("./three/MiniBeyScene"), {
  ssr: false,
  loading: () => <SceneLoader />,
});

const ICONS: Record<PerformanceType, typeof Swords> = {
  attack: Swords,
  defense: Shield,
  stamina: Timer,
  balance: Scale,
};

const STAT_KEYS: { key: keyof TypeInfo["stats"]; label: string }[] = [
  { key: "attack", label: "Attack" },
  { key: "speed", label: "Speed" },
  { key: "stamina", label: "Stamina" },
  { key: "burstResistance", label: "Burst Res." },
  { key: "defense", label: "Defense" },
];

/** Opens the collection pre-filtered to a type. */
export function showTypeInCollection(type: PerformanceType) {
  window.dispatchEvent(new CustomEvent("bx:filter", { detail: type }));
  smoothScrollTo(document.getElementById("collection"));
}

function RadarChart({ types }: { types: TypeInfo[] }) {
  const size = 300;
  const c = size / 2;
  const r = 110;
  const n = STAT_KEYS.length;
  const point = (i: number, v: number) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return [c + Math.cos(a) * r * (v / 10), c + Math.sin(a) * r * (v / 10)];
  };
  return (
    <svg viewBox={`-40 -10 ${size + 80} ${size + 20}`} className="h-full w-full" role="img" aria-labelledby="radar-title">
      <title id="radar-title">{`Radar chart comparing ${types.map((t) => t.name).join(", ") || "no types"} across attack, speed, stamina, burst resistance and defense.`}</title>
      {[2, 4, 6, 8, 10].map((lvl) => (
        <polygon
          key={lvl}
          points={STAT_KEYS.map((_, i) => point(i, lvl).join(",")).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
        />
      ))}
      {STAT_KEYS.map((s, i) => {
        const [x, y] = point(i, 10);
        const [lx, ly] = point(i, 12.2);
        return (
          <g key={s.key}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="rgba(255,255,255,0.12)" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="rgba(255,255,255,0.6)"
              fontFamily="var(--font-display)"
              letterSpacing="1"
            >
              {s.label.toUpperCase()}
            </text>
          </g>
        );
      })}
      {types.map((t) => (
        <motion.polygon
          key={t.id}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: "150px 150px" }}
          transition={{ duration: 0.5 }}
          points={STAT_KEYS.map((s, i) => point(i, t.stats[s.key]).join(",")).join(" ")}
          fill={t.color}
          fillOpacity={0.18}
          stroke={t.color}
          strokeWidth={2}
        />
      ))}
    </svg>
  );
}

export default function BeybladeTypes() {
  const reduced = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<PerformanceType>("attack");
  const [compare, setCompare] = useState<PerformanceType[]>(["attack", "defense"]);
  const active = TYPES.find((t) => t.id === activeId)!;
  const Icon = ICONS[active.id];
  const examples = PRODUCTS.filter((p) => p.type === active.id);
  const compareTypes = TYPES.filter((t) => compare.includes(t.id));

  const toggleCompare = (id: PerformanceType) =>
    setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <section id="types" className="relative overflow-hidden bg-void py-24 sm:py-32">
            <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10">
        <SectionHeading
          index="04"
          eyebrow="Performance types"
          title="Choose your"
          accent="battle style."
          description="Every Beyblade X belongs to one of four performance types. Each one wins in a different way, and each has a natural counter."
        />

        {/* Type tabs */}
        <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4" role="tablist" aria-label="Performance types">
          {TYPES.map((t) => {
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`type-tab-${t.id}`}
                aria-selected={isActive}
                aria-controls="type-panel"
                onClick={() => setActiveId(t.id)}
                className={cn(
                  "group relative rounded-2xl border px-5 py-4 text-left transition-colors duration-500",
                  isActive ? "border-cream/30 bg-steel" : "border-cream/10 hover:border-cream/25",
                )}
              >
                <span className="label flex items-center gap-2 text-cream/60">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
                  {t.tagline}
                </span>
                <span className={cn("headline mt-3 block text-3xl sm:text-4xl", isActive ? "text-cream" : "text-cream/35 group-hover:text-cream/70")}>
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active type panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            id="type-panel"
            role="tabpanel"
            aria-labelledby={`type-tab-${active.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.05fr]"
          >
            <div className="relative h-[360px] overflow-hidden rounded-2xl bg-steel sm:h-[460px]">
              <span
                aria-hidden
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 58%, ${active.color}40, transparent 60%)` }}
              />
              <span
                aria-hidden
                className="headline pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[8rem] leading-none text-cream/[0.05] sm:text-[11rem]"
              >
                {active.name}
              </span>
              <SceneShell
                fallback={
                  <div className="flex h-full items-center justify-center p-10">
                    <BeyIllustration visual={active.visual} spinning={!reduced} className="w-full max-w-[280px]" />
                  </div>
                }
              >
                {(isOn) => <MiniBeyScene active={isOn} visual={active.visual} reduced={reduced} />}
              </SceneShell>
              <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 text-cream">
                <Icon size={14} style={{ color: active.color }} />
                <p className="label">{active.name} type</p>
              </div>
              <ul className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                {active.traits.map((tr) => (
                  <li key={tr} className="glass label rounded-full px-3 py-1.5 text-cream">
                    {tr}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-7">
              <p className="font-display text-2xl font-medium leading-snug text-cream">{active.summary}</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="label flex items-center gap-2 text-defense">
                    <Plus size={14} /> Strengths
                  </h3>
                  <ul className="mt-3 space-y-2 border-t border-dashed border-cream/15 pt-3">
                    {active.strengths.map((s) => (
                      <li key={s} className="text-base leading-snug text-white/75">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="label flex items-center gap-2 text-crimson">
                    <Minus size={14} /> Weaknesses
                  </h3>
                  <ul className="mt-3 space-y-2 border-t border-dashed border-cream/15 pt-3">
                    {active.weaknesses.map((s) => (
                      <li key={s} className="text-base leading-snug text-white/75">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="glass relative rounded-2xl p-6">
                <h3 className="label text-accent">How to play it</h3>
                <ol className="mt-3 space-y-2">
                  {active.strategy.map((s, i) => (
                    <li key={s} className="flex gap-3 text-base text-cream/85">
                      <span className="font-display text-base font-semibold text-cream/40">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="label text-cream/45">Real examples</h3>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {examples.map((p) => (
                    <span key={p.id} className="flex items-center gap-2 rounded-full bg-steel py-1.5 pl-1.5 pr-4">
                      <BeyIllustration visual={p.visual} className="h-10 w-10" />
                      <span className="font-display text-base font-medium text-cream">
                        {p.name} <span style={{ color: active.color }}>{p.config}</span>
                      </span>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => showTypeInCollection(active.id)}
                    className="label inline-flex items-center gap-1 rounded-full border border-cream/25 px-4 py-2.5 text-cream hover:border-accent hover:text-accent"
                  >
                    See them all <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Comparison */}
        <div className="mt-24 grid grid-cols-1 items-center gap-10 border-t-2 border-white/15 pt-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="headline text-5xl text-white sm:text-6xl">
              Compare <span className="text-accent">types</span>
            </h3>
            <p className="mt-3 text-sm text-white/60">
              Toggle types to overlay their profiles. Values are an illustrative guide to each type&apos;s tendencies —
              not official statistics. Real performance depends on the exact parts used.
            </p>
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Types to compare">
              {TYPES.map((t) => {
                const on = compare.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleCompare(t.id)}
                    className={cn(
                      "inline-flex items-center gap-2 border px-4 py-2 font-display text-sm font-bold tracking-wider transition",
                      on ? "text-white" : "border-white/15 text-white/50 hover:text-white",
                    )}
                    style={on ? { borderColor: t.color, background: `${t.color}22` } : undefined}
                  >
                    <span className="grid h-4 w-4 place-items-center border" style={{ borderColor: t.color, background: on ? t.color : "transparent" }}>
                      {on && <Check size={10} className="text-black" />}
                    </span>
                    {t.name.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <caption className="sr-only">Illustrative stat comparison of selected types</caption>
                <thead>
                  <tr className="text-[10px] uppercase tracking-wider text-white/40">
                    <th className="py-2 font-normal">Stat</th>
                    {compareTypes.map((t) => (
                      <th key={t.id} className="py-2 font-display font-bold" style={{ color: t.color }}>
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STAT_KEYS.map((s) => (
                    <tr key={s.key} className="border-t border-white/5">
                      <th scope="row" className="py-2 font-normal text-white/60">
                        {s.label}
                      </th>
                      {compareTypes.map((t) => (
                        <td key={t.id} className="py-2 pr-4">
                          <div className="h-1.5 w-full max-w-[110px] bg-white/10">
                            <motion.div
                              className="h-full"
                              style={{ background: t.color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${t.stats[s.key] * 10}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {compareTypes.length === 0 && <p className="mt-2 text-sm text-white/40">Select at least one type to compare.</p>}
            </div>
            <p className="mt-6 text-sm text-white/55">
              <strong className="text-white">Classic matchups:</strong> Attack tends to beat Stamina, Stamina tends to
              outlast Defense, and Defense tends to stop Attack — while Balance can adapt to any of them.
            </p>
          </div>
          <div className="mx-auto w-full max-w-md">
            <RadarChart types={compareTypes} />
          </div>
        </div>
      </div>
    </section>
  );
}
