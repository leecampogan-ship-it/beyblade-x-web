"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ChevronDown } from "lucide-react";
import type * as THREE from "three";
import SceneShell from "./three/SceneShell";
import SceneLoader from "./three/SceneLoader";
import BeyIllustration from "./BeyIllustration";
import type { PartId } from "./three/BeybladeModel";
import { PRODUCTS } from "@/lib/products";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

const StoryScene = dynamic(() => import("./three/StoryScene"), {
  ssr: false,
  loading: () => <SceneLoader label="Loading Sword Dran" />,
});

const HERO = PRODUCTS[0];

/* ------------------------------------------------------------------ */
/* Workbench: warm desk + cutting mat with ruler markings (all vector) */
/* ------------------------------------------------------------------ */
function CuttingMat() {
  const W = 1000;
  const H = 700;
  const lines: React.ReactNode[] = [];
  for (let x = 40; x <= W - 20; x += 20) {
    const major = (x - 40) % 100 === 0;
    lines.push(
      <line key={`v${x}`} x1={x} y1={20} x2={x} y2={H - 40} stroke="#f8f8f8" strokeOpacity={major ? 0.32 : 0.12} strokeWidth={major ? 1.3 : 0.8} />,
    );
  }
  for (let y = 20; y <= H - 40; y += 20) {
    const major = (y - 20) % 100 === 0;
    lines.push(
      <line key={`h${y}`} x1={40} y1={y} x2={W - 20} y2={y} stroke="#f8f8f8" strokeOpacity={major ? 0.32 : 0.12} strokeWidth={major ? 1.3 : 0.8} />,
    );
  }
  const nums: React.ReactNode[] = [];
  for (let i = 0; i <= 45; i += 1) {
    const x = 40 + i * 20;
    if (i % 2 === 0 && x <= W - 20)
      nums.push(
        <text key={`n${i}`} x={x} y={H - 22} fill="#f8f8f8" fillOpacity="0.6" fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)">
          {i * 10}
        </text>,
      );
  }
  for (let j = 0; j <= 31; j += 1) {
    const y = H - 40 - j * 20;
    if (y >= 20 && j % 2 === 0)
      nums.push(
        <text key={`m${j}`} x={26} y={y + 4} fill="#f8f8f8" fillOpacity="0.6" fontSize="11" textAnchor="middle" fontFamily="var(--font-sans)">
          {j * 10}
        </text>,
      );
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.45)]" aria-hidden>
      <rect x="0" y="0" width={W} height={H} rx="26" fill="#0d0f0b" />
      <rect x="0" y="0" width={W} height={H} rx="26" fill="url(#matShade)" />
      <rect x="1.5" y="1.5" width={W - 3} height={H - 3} rx="25" fill="none" stroke="#c6f31a" strokeOpacity="0.35" strokeWidth="2" />
      <defs>
        <radialGradient id="matShade" cx="0.45" cy="0.4" r="0.8">
          <stop offset="0" stopColor="#1f2618" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      {lines}
      {nums}
      {/* 45° guides */}
      <line x1="40" y1={H - 40} x2={H - 20} y2="20" stroke="#f8f8f8" strokeOpacity="0.16" strokeDasharray="6 6" />
      <circle cx="560" cy="340" r="160" fill="none" stroke="#f8f8f8" strokeOpacity="0.16" strokeDasharray="4 6" />
    </svg>
  );
}

/** A launcher ripcord and a spare Bit lying on the desk — simple vector props. */
function DeskProps() {
  return (
    <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {/* ripcord */}
      <g transform="translate(1180 120) rotate(32)" opacity="0.95">
        <rect x="0" y="0" width="420" height="34" rx="6" fill="#1b1b1f" />
        {Array.from({ length: 26 }).map((_, i) => (
          <rect key={i} x={14 + i * 15} y="6" width="7" height="22" fill="#33333a" />
        ))}
        <rect x="-70" y="-20" width="80" height="74" rx="18" fill="#d9d9d9" />
        <rect x="-58" y="-6" width="56" height="46" rx="12" fill="#b9b9b9" />
      </g>
      {/* pencil */}
      <g transform="translate(150 610) rotate(-38)">
        <rect x="0" y="0" width="380" height="18" rx="3" fill="#c9c9c9" />
        <polygon points="380,0 420,9 380,18" fill="#e6e6e6" />
        <polygon points="404,5 420,9 404,13" fill="#333" />
        <rect x="-26" y="0" width="26" height="18" rx="2" fill="#9a9a9a" />
      </g>
    </svg>
  );
}

/* ----------------------------------------------------- */
/* Scroll-scrubbed word reveal                            */
/* ----------------------------------------------------- */
function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{" "}
    </motion.span>
  );
}

function ScrollWords({
  text,
  progress,
  start,
  end,
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  className?: string;
}) {
  const words = text.split(" ");
  const step = (end - start) / words.length;
  return (
    <p className={className}>
      {words.map((w, i) => (
        <Word key={i} word={w} progress={progress} range={[start + i * step, start + (i + 1) * step]} />
      ))}
    </p>
  );
}

/** Fades a block in over [a,b] and out over [c,d]. */
function useWindow(p: MotionValue<number>, a: number, b: number, c: number, d: number) {
  return useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
}

/* ----------------------------------------------------- */
/* Dotted "design tool" frame with orange handles         */
/* ----------------------------------------------------- */
function Handles() {
  const pos = ["left-0 top-0", "left-1/2 top-0", "right-0 top-0", "left-0 top-1/2", "right-0 top-1/2", "left-0 bottom-0", "left-1/2 bottom-0", "right-0 bottom-0"];
  return (
    <>
      {pos.map((p) => (
        <span
          key={p}
          className={cn("absolute h-2 w-2 bg-accent", p, "-translate-x-1/2 -translate-y-1/2", p.includes("right-0") && "translate-x-1/2", p.includes("bottom-0") && "translate-y-1/2")}
        />
      ))}
    </>
  );
}

const FRAMES: { id: PartId; title: string; sub: string; w: string; h: string }[] = [
  { id: "blade", title: "01 · Blade", sub: "Sword Dran", w: "min(40vmin,380px)", h: "min(22vmin,210px)" },
  { id: "ratchet", title: "02 · Ratchet", sub: "3-60", w: "min(22vmin,210px)", h: "min(11vmin,110px)" },
  { id: "bit", title: "03 · Bit", sub: "Flat (F)", w: "min(15vmin,140px)", h: "min(12vmin,110px)" },
];

/* ----------------------------------------------------- */
/* Story hero                                             */
/* ----------------------------------------------------- */
export default function StoryHero() {
  const reduced = usePrefersReducedMotion();
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  // Anchors for the part frames
  const anchors = useRef<Partial<Record<PartId, THREE.Object3D | null>>>({});
  const frameEls = useRef<Partial<Record<PartId, HTMLDivElement | null>>>({});
  const resolveLabels = () => FRAMES.map((f) => ({ el: frameEls.current[f.id], object: anchors.current[f.id] }));

  // Layer animations
  const benchOpacity = useTransform(p, [0.06, 0.22], [1, 0]);
  const benchScale = useTransform(p, [0, 0.22], [1, 1.12]);
  const glowOpacity = useTransform(p, [0.1, 0.3], [0, 1]);
  const introOpacity = useTransform(p, [0, 0.09], [1, 0]);
  const introY = useTransform(p, [0, 0.12], [0, -80]);
  const s2 = useWindow(p, 0.2, 0.26, 0.4, 0.45);
  const s3 = useWindow(p, 0.47, 0.52, 0.68, 0.73);
  const s4 = useWindow(p, 0.75, 0.79, 0.9, 0.96);
  const ripX = useTransform(p, [0.74, 0.96], ["45%", "-75%"]);
  const fallbackRotate = useTransform(p, [0, 1], [0, 900]);

  return (
    <section id="home" ref={section} className="relative h-[560vh] bg-void" aria-label="Beyblade X — introduction">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ---------- Backgrounds ---------- */}
        <motion.div style={{ opacity: glowOpacity }} className="warm-glow absolute inset-0" />
        <motion.div style={{ opacity: benchOpacity, scale: benchScale }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[#050505]" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(97deg, rgba(0,0,0,0.12) 0 2px, transparent 2px 11px), repeating-linear-gradient(97deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 37px)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-[92vmin] w-[132vmin] -translate-x-[42%] -translate-y-1/2 -rotate-[7deg]">
            <CuttingMat />
          </div>
          <DeskProps />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55))]" />
        </motion.div>

        {/* ---------- Giant sliding word (stage 4) ---------- */}
        <motion.p
          aria-hidden
          style={{ x: ripX, opacity: s4 }}
          className="headline pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[30vw] text-cream"
        >
          Let it rip.
        </motion.p>

        {/* ---------- 3D ---------- */}
        <div className="absolute inset-0">
          <SceneShell
            rootMargin="0px"
            fallback={
              <div className="flex h-full items-center justify-center">
                <motion.div style={{ rotate: reduced ? 0 : fallbackRotate }} className="w-[46vmin]">
                  <BeyIllustration visual={HERO.visual} title={`${HERO.name} ${HERO.config}`} />
                </motion.div>
              </div>
            }
          >
            {(active) => (
              <StoryScene
                active={active}
                visual={HERO.visual}
                progress={p}
                reduced={reduced}
                resolveLabels={resolveLabels}
                onAnchor={(part, o) => {
                  anchors.current[part] = o;
                }}
              />
            )}
          </SceneShell>
          {/* Part frames (positioned every frame by ProjectedLabels) */}
          {FRAMES.map((f) => (
            <div
              key={f.id}
              ref={(el) => {
                frameEls.current[f.id] = el;
              }}
              style={{ visibility: "hidden" }}
              className="pointer-events-none absolute left-0 top-0"
            >
              <motion.div style={{ opacity: s3, width: f.w, height: f.h }} className="relative border border-dashed border-cream/60">
                <Handles />
                <span className="label absolute -top-7 left-0 whitespace-nowrap text-cream">
                  {f.title} <span className="text-accent">{f.sub}</span>
                </span>
              </motion.div>
            </div>
          ))}
        </div>

        {/* ---------- Stage 1: intro ---------- */}
        <motion.div style={{ opacity: introOpacity, y: introY }} className="pointer-events-none absolute inset-0">
          <div className="mx-auto h-full max-w-[1600px] px-5 pt-20 sm:px-10">
            <p className="label ml-[0.2em] text-cream/90 lg:ml-[38%]">Built for the stadium. Made to rip.</p>
            <h1 className="headline mt-2 text-[clamp(4.2rem,15vw,15rem)] font-extrabold leading-[0.82] text-cream">
              Beyblade<span className="neon"> X</span>
            </h1>
          </div>
          <p className="absolute right-5 top-[46%] max-w-[21rem] font-display text-[clamp(1.1rem,1.6vw,1.6rem)] font-medium leading-snug text-cream max-lg:bottom-28 max-lg:top-auto sm:right-10">
            Three parts, one gear-toothed rail and a launch that goes from zero to Xtreme Dash in a heartbeat.
          </p>
          <div className="glass absolute bottom-8 left-5 hidden w-[19rem] rounded-xl p-5 sm:left-10 lg:block">
            <p className="font-display text-xl font-semibold uppercase leading-tight">
              An independent
              <br />
              3D fan experience
              <br />
              for Beyblade X.
            </p>
            <div className="dotted-underline mt-10 w-full" />
            <p className="mt-4 text-right font-display text-lg leading-snug text-cream/90">
              The most over-engineered spinning top you&apos;ll ever scroll through.
            </p>
          </div>
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-l-md bg-cream px-2 py-4 text-ink lg:block">
            <span className="label block [writing-mode:vertical-rl]">
              {HERO.name} {HERO.config}
            </span>
          </div>
        </motion.div>

        {/* ---------- Stage 2: isn't just a top ---------- */}
        <motion.div style={{ opacity: s2 }} className="pointer-events-none absolute inset-0 mx-auto max-w-[1600px] px-5 sm:px-10">
          <h2 className="headline absolute left-5 top-[22%] text-[clamp(2.4rem,4.4vw,4.6rem)] sm:left-10 lg:top-[42%]">
            <span className="text-cream/45">Isn&apos;t just</span>
            <br />a spinning top.
          </h2>
          <ScrollWords
            text="Beyblade X isn't just a spinning top. It's twenty-five years of battle-tested engineering*, squeezed into something that fits in your palm."
            progress={p}
            start={0.22}
            end={0.38}
            className="absolute bottom-24 right-5 max-w-[22rem] font-display text-[clamp(1.15rem,1.7vw,1.7rem)] font-medium leading-snug sm:right-10 lg:bottom-auto lg:top-[42%]"
          />
          <div className="absolute bottom-8 right-5 text-right sm:right-10">
            <div className="dotted-underline ml-auto w-16" />
            <p className="label mt-2 text-cream/50">
              * Since the first
              <br />
              Beyblade in 1999
            </p>
          </div>
        </motion.div>

        {/* ---------- Stage 3: three parts ---------- */}
        <motion.div style={{ opacity: s3 }} className="pointer-events-none absolute inset-0 mx-auto max-w-[1600px] px-5 sm:px-10">
          <h2 className="headline absolute left-5 top-[18%] text-[clamp(2.4rem,4.4vw,4.6rem)] sm:left-10 lg:top-[40%]">
            <span className="text-cream/45">Three parts.</span>
            <br />
            One machine.
          </h2>
          <ScrollWords
            text="The Blade does the hitting. The Ratchet locks it all together and sets the height. The Bit touches the floor — and grabs the rail."
            progress={p}
            start={0.49}
            end={0.64}
            className="absolute bottom-20 right-5 max-w-[22rem] font-display text-[clamp(1.15rem,1.7vw,1.7rem)] font-medium leading-snug sm:right-10 lg:bottom-auto lg:top-[40%]"
          />
        </motion.div>

        {/* ---------- Stage 4: let it rip ---------- */}
        <motion.div style={{ opacity: s4 }} className="pointer-events-none absolute inset-0 mx-auto max-w-[1600px] px-5 sm:px-10">
          <p className="headline absolute left-5 top-[16%] text-[clamp(1.6rem,2.4vw,2.6rem)] sm:left-10">
            <span className="text-cream/50">So fast,</span>
            <br />
            it&apos;s a blur.
          </p>
        </motion.div>

        {/* ---------- Scroll cue ---------- */}
        <motion.a
          href="#history"
          style={{ opacity: introOpacity }}
          className="label absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 text-cream/70 hover:text-cream"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full border border-current">
            <ChevronDown size={14} />
          </span>
          Scroll to continue
        </motion.a>
      </div>
    </section>
  );
}
