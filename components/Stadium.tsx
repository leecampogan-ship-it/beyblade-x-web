"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, RotateCcw, Cog, Gauge, Navigation, Target } from "lucide-react";
import SectionHeading from "./SectionHeading";
import SceneShell from "./three/SceneShell";
import type { BattlePhase, FinishId } from "./three/StadiumScene";
import { cn, hasWebGL } from "@/lib/utils";

const noop = () => () => {};

const StadiumScene = dynamic(() => import("./three/StadiumScene"), {
  ssr: false,
  loading: () => null,
});

/** Shown until the 3D battle starts (download + scene start-up): the stadium diagram, faint and pulsing, instead of an empty panel. */
function StadiumPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center p-8" role="status" aria-label="Loading 3D stadium">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/stadium/xtreme-stadium-diagram.svg" alt="" className="max-h-[78%] animate-pulse opacity-30" />
    </div>
  );
}

const FINISHES: { id: FinishId; name: string; points: number; color: string; text: string }[] = [
  {
    id: "xtreme",
    name: "Xtreme Finish",
    points: 3,
    color: "#ff4a2e",
    text: "Knock the opponent out of the stadium through the opening into the Xtreme Zone. The most valuable finish, usually set up by an Xtreme Dash off the rail.",
  },
  {
    id: "over",
    name: "Over Finish",
    points: 2,
    color: "#ffb020",
    text: "Knock the opponent into one of the Over Zones — the pockets at the sides of the stadium.",
  },
  {
    id: "burst",
    name: "Burst Finish",
    points: 2,
    color: "#a259ff",
    text: "Hit the opponent so hard that its Blade, Ratchet and Bit separate mid-battle.",
  },
  {
    id: "spin",
    name: "Spin Finish",
    points: 1,
    color: "#2fd67b",
    text: "Outlast your opponent. When one Beyblade stops spinning, the one still spinning wins.",
  },
];

const PHASE_TEXT: Record<BattlePhase, string> = {
  launch: "3… 2… 1… GO SHOOT!",
  battle: "BATTLE IN PROGRESS",
  dash: "XTREME DASH!",
  impact: "IMPACT!",
  finish: "",
};

const MECHANICS = [
  {
    icon: Target,
    title: "Stadium structure",
    text: "The Xtreme Stadium is a sloped bowl. Gravity pulls Beyblades toward the centre, while openings at the edge lead to the Xtreme Zone and two Over Zones.",
  },
  {
    icon: Cog,
    title: "X-Celerator Rail",
    text: "A ring of gear teeth runs around the edge of the bowl. When a Bit's gear meshes with it, the top's spin is converted into a burst of forward speed.",
  },
  {
    icon: Gauge,
    title: "Xtreme Dash",
    text: "The sudden acceleration along the rail. A dashing Beyblade can leave the rail at high speed and slam into its opponent.",
  },
  {
    icon: Navigation,
    title: "Movement & strategy",
    text: "Aggressive bits roam and seek the rail; stable bits hold the centre. Launch angle and power decide which path a Beyblade takes.",
  },
];

export default function Stadium() {
  const [finish, setFinish] = useState<FinishId>("xtreme");
  const [playId, setPlayId] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [phase, setPhase] = useState<BattlePhase | null>(null);
  const webgl = useSyncExternalStore(noop, hasWebGL, () => true);
  const current = FINISHES.find((f) => f.id === finish)!;

  const choose = (id: FinishId) => {
    setFinish(id);
    setPlayId((n) => n + 1);
    setPlaying(true);
  };

  const caption = !phase ? "" : phase === "finish" ? `${current.name.toUpperCase()} · +${current.points}` : PHASE_TEXT[phase];

  return (
    <section id="stadium" className="section-divider relative overflow-hidden bg-void py-24 sm:py-32">
            <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10">
        <SectionHeading
            index="05"
          eyebrow="Stadium & battle system"
          title="Enter the"
          accent="Xtreme Stadium."
          description="Watch an animated battle demonstration. Choose a finish below to see how each one is scored — and see the X-Celerator Rail light up as a Beyblade performs an Xtreme Dash."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-steel">
            <div className="relative h-[380px] sm:h-[520px]">
              <AnimatePresence>
                {webgl && !phase && (
                  <motion.div key="placeholder" exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                    <StadiumPlaceholder />
                  </motion.div>
                )}
              </AnimatePresence>
              <SceneShell
                fallback={
                  <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/stadium/xtreme-stadium-diagram.svg" alt="Diagram of the Xtreme Stadium showing the X-Celerator Rail, Xtreme Zone and Over Zones" className="max-h-[80%]" />
                    <p className="mt-3 text-xs text-white/65">3D demo unavailable — showing stadium diagram.</p>
                  </div>
                }
              >
                {(active) => (
                  <StadiumScene active={active} finish={finish} playId={playId} playing={playing} onPhase={setPhase} />
                )}
              </SceneShell>

              {/* Caption */}
              <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-center" aria-live="polite">
                <AnimatePresence mode="wait">
                  {caption && (
                    <motion.p
                      key={caption}
                      initial={{ opacity: 0, scale: 1.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="headline rounded-full px-6 py-2.5 text-2xl text-ink sm:text-4xl"
                      style={{
                        background: phase === "finish" ? current.color : phase === "dash" ? "#c6f31a" : "#f8f8f8",
                      }}
                    >
                      {caption}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pause demonstration" : "Play demonstration"}
                  className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink hover:bg-accent"
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlayId((n) => n + 1);
                    setPlaying(true);
                  }}
                  aria-label="Replay demonstration"
                  className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink hover:bg-accent"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Finish selector */}
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Battle finish demonstrations">
            {FINISHES.map((f) => {
              const on = f.id === finish;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => choose(f.id)}
                  className={cn(
                    "group relative grid grid-cols-[4.5rem_1fr] items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-500",
                    on
                      ? "border-accent/70 bg-steel text-cream shadow-[0_0_32px_-8px_rgba(198,243,26,0.45)]"
                      : "border-cream/10 text-cream hover:border-cream/30",
                  )}
                >
                  <span
                    className={cn(
                      "headline text-center text-6xl leading-[0.8] transition-colors duration-500",
                      on ? "neon" : "text-cream/40 group-hover:text-cream/70",
                    )}
                  >
                    {f.points}
                    <span className="label mt-2 block">pt{f.points > 1 ? "s" : ""}</span>
                  </span>
                  <span>
                    <span className="headline flex items-center gap-2 text-2xl">
                      {f.name}
                      {on && <Play size={16} fill="currentColor" />}
                    </span>
                    <span className={cn("mt-1.5 block text-sm leading-snug", on ? "text-cream/75" : "text-cream/65")}>{f.text}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-20 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {MECHANICS.map((m, i) => (
            <motion.li
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-t border-dashed border-cream/20 pt-6"
            >
              <h3 className="headline flex items-center gap-2 text-2xl text-cream">
                <m.icon className="text-accent" size={18} /> {m.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-white/72">{m.text}</p>
            </motion.li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-white/55">
          Points shown follow the standard Beyblade X scoring (Xtreme 3, Over 2, Burst 2, Spin 1). Tournament formats may
          vary — always check the official rules for your event. The animation is a simplified demonstration, not a
          physics simulation.
        </p>
      </div>
    </section>
  );
}
