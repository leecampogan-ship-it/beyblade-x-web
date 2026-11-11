"use client";

import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    word: "Build",
    text: "Snap a Blade, a Ratchet and a Bit together. Every part changes how your Beyblade fights.",
  },
  {
    word: "Launch",
    text: "Lock it on the launcher. “3, 2, 1, Go Shoot!” Rip the cord and send it into the stadium.",
  },
  {
    word: "Battle",
    text: "The tops slam together. When a Bit's gear catches the rail, the Beyblade rockets forward: an Xtreme Dash.",
  },
  {
    word: "Finish",
    text: "Score by knocking your opponent out, bursting it apart, or simply spinning longer.",
  },
];

const FEATURES = [
  {
    title: "X-Celerator Rail",
    text: "A ring of gear teeth around the edge of the Xtreme Stadium. Bits have teeth that mesh with it, turning spin into straight-line speed.",
  },
  {
    title: "Extreme acceleration",
    text: "Riding the rail fires a Beyblade forward. The collisions are faster and harder than in any previous generation.",
  },
  {
    title: "Customisation",
    text: "Mix and match Blades, Ratchets and Bits. Change just the Bit and a calm defender becomes an aggressive attacker.",
  },
  {
    title: "Four performance types",
    text: "Attack, Defense, Stamina and Balance each win in a different way. Picking the right one is half the battle.",
  },
  {
    title: "Competitive battling",
    text: "Points-based matches with four kinds of finish reward both raw power and smart strategy.",
  },
];

function RailDiagram() {
  return (
    <svg viewBox="0 -24 320 372" className="h-full w-full" role="img" aria-labelledby="rail-diagram-title">
      <title id="rail-diagram-title">
        Top-down diagram of the Xtreme Stadium: Sword Dran rides the X-Celerator Rail around the edge while Helm Knight
        spins in the centre.
      </title>
      <defs>
        <path id="rail-path" d="M160 30 A130 130 0 1 1 159.9 30" />
        <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1" fill="#ffffff" opacity="0.08" />
        </pattern>
      </defs>
      <circle cx="160" cy="160" r="150" fill="#101318" stroke="#ffffff" strokeWidth="4" />
      <circle cx="160" cy="160" r="148" fill="url(#dots)" />
      {[45, 85].map((r) => (
        <circle key={r} cx="160" cy="160" r={r} fill="none" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1.5" />
      ))}
      {/* Rail with teeth */}
      <circle cx="160" cy="160" r="130" fill="none" stroke="#c6f31a" strokeWidth="9" strokeDasharray="3 4" />
      {/* Xtreme zone */}
      <path d="M128 308 A150 150 0 0 0 192 308" stroke="#ff2d3d" strokeWidth="12" fill="none" />
      <text x="160" y="338" textAnchor="middle" fill="#c6f31a" fontSize="15" fontWeight="700" fontFamily="var(--font-display)">
        XTREME ZONE
      </text>
      <text x="160" y="-4" textAnchor="middle" fill="#c6f31a" fontSize="15" fontWeight="700" fontFamily="var(--font-display)">
        X-CELERATOR RAIL
      </text>
      {/* Opponent (Helm Knight) spinning in the centre */}
      <g transform="translate(160 160)">
        <image href="/images/beyblades/helm-knight-3-80n.webp" x="-26" y="-26" width="52" height="52">
          <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="0.6s" repeatCount="indefinite" />
        </image>
      </g>
      {/* Dashing Beyblade (Sword Dran) */}
      <g>
        <circle r="24" fill="#c6f31a" opacity="0.25">
          <animateMotion dur="2.4s" begin="-0.1s" repeatCount="indefinite">
            <mpath href="#rail-path" />
          </animateMotion>
        </circle>
        <g>
          <animateMotion dur="2.4s" repeatCount="indefinite">
            <mpath href="#rail-path" />
          </animateMotion>
          <image href="/images/beyblades/sword-dran-3-60f.webp" x="-20" y="-20" width="40" height="40">
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="0.5s" repeatCount="indefinite" />
          </image>
        </g>
      </g>
    </svg>
  );
}

function GearDiagram() {
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" role="img" aria-labelledby="gear-diagram-title">
      <title id="gear-diagram-title">
        Side view: the gear teeth on a Beyblade X Bit mesh with the teeth of the X-Celerator Rail, launching the top forward.
      </title>
      <rect x="0" y="118" width="320" height="14" fill="#f8f8f8" />
      <g fill="#f8f8f8">
        {Array.from({ length: 27 }).map((_, i) => (
          <rect key={i} x={i * 12} y="110" width="6" height="9" />
        ))}
      </g>
      <g className="motion-safe:animate-[railslide_2.6s_cubic-bezier(.6,0,.2,1)_infinite]">
        <rect x="40" y="38" width="90" height="18" fill="#f8f8f8" />
        <rect x="55" y="56" width="60" height="16" fill="#3a3d34" />
        <path d="M62 72 H108 L98 104 H72 Z" fill="#c6f31a" />
        <g fill="#f8f8f8">
          {[66, 74, 82, 90, 98].map((x) => (
            <rect key={x} x={x} y="100" width="5" height="9" />
          ))}
        </g>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={-10 - i * 22} y={46 + i * 14} width={18 - i * 4} height="4" fill="#f8f8f8" opacity={0.7 - i * 0.2} />
        ))}
      </g>
      <style>{`@keyframes railslide { 0% { transform: translateX(-60px); } 75% { transform: translateX(150px); } 100% { transform: translateX(150px); opacity: 0; } }`}</style>
    </svg>
  );
}

export default function AboutBeybladeX() {
  return (
    <section id="about" className="relative overflow-hidden bg-void py-24 sm:py-32">
      <div className="speedlines absolute inset-0 opacity-70" />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <SectionHeading
              stacked
              index="02"
              eyebrow="What is Beyblade X?"
              title="Spinning tops."
              accent="Supercharged."
              description="Beyblade X is the fourth generation of Beyblade, the battling-top game created by Takara Tomy. Two players launch custom-built spinning tops into a stadium, and they collide until one is knocked out, burst apart or stops spinning. What's new is a geared rail around the stadium that turns spin into ridiculous speed."
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass mt-8 inline-block rounded-2xl px-5 py-4"
            >
              <span className="block font-display text-lg font-medium text-cream">
                <span className="label mr-2 text-accent">Never played?</span> Pick a Beyblade, launch
                it, and let physics do the rest.
              </span>
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, rotate: -20, scale: 0.85 }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.2, 0.9, 0.25, 1] }}
            className="mx-auto w-full max-w-md"
          >
            <RailDiagram />
          </motion.div>
        </div>

        {/* ---------- How a battle works ---------- */}
        <div className="mt-28">
          <p className="eyebrow">How a battle works</p>
          <ol className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.word}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="group relative pr-6"
              >
                <div className="flex items-end gap-2">
                  <span className="label text-cream/40">0{i + 1}</span>
                  <span className="headline ml-3 text-5xl text-cream">{s.word}</span>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {i < STEPS.length - 1 && <span className="ml-2 h-px flex-1 border-t border-dashed border-cream/20 max-lg:hidden" />}
                </div>
                <p className="mt-4 text-base leading-relaxed text-white/65">{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* ---------- What makes it different ---------- */}
        <div className="mt-28 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h3 className="headline text-5xl text-white sm:text-6xl">
              What makes it <span className="text-accent">different</span>
            </h3>
            <div className="relative mt-8 overflow-hidden rounded-2xl bg-steel p-6 text-cream">
              <div className="halftone-dark absolute inset-0" />
              <p className="label relative text-cream/50">Bit gear + rail teeth =</p>
              <p className="headline relative mt-2 text-5xl text-accent">Xtreme Dash</p>
              <div className="relative mt-2">
                <GearDiagram />
              </div>
            </div>
            <p className="mt-5 text-base leading-relaxed text-white/60">
              Every Beyblade X Bit has gear teeth near its tip. When a spinning top drifts to the edge, those teeth catch
              the rail like a cog on a track, and the top is flung forward.
            </p>
          </div>
          <ul className="border-t border-dashed border-cream/20">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-dashed border-cream/20 py-8"
              >
                <span className="label pt-2 text-accent">({i + 1})</span>
                <div>
                  <h4 className="headline text-3xl text-cream/45 transition-colors duration-500 group-hover:text-cream sm:text-4xl">{f.title}</h4>
                  <p className="mt-2 max-w-xl text-base leading-relaxed text-white/60">{f.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
