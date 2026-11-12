"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const SEEN_KEY = "bx:intro-seen";
/** Long enough for the intro rings to draw in, short enough not to hold up the page. */
const INTRO_MS = 700;

/**
 * Short branded intro loader. It is server-rendered so the page never flashes before it,
 * but it starts fading out as soon as the app hydrates (it no longer waits for every asset).
 * It plays once per browser session and is skipped for users who prefer reduced motion.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fast, setFast] = useState(false);
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage can be blocked (private mode); just play the intro.
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skip = seen || reduced;
    const t = setTimeout(
      () => {
        setFast(skip);
        setVisible(false);
      },
      skip ? 0 : INTRO_MS,
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: fast ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] } }}
          role="status"
          aria-label="Loading"
          data-loader
        >
          <ConstructionLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Dotted construction circles with orange handles that draw themselves in. */
function ConstructionLoader() {
  const ring = (r: number, delay: number) => (
    <motion.circle
      cx="150"
      cy="150"
      r={r}
      fill="none"
      stroke="#f8f8f8"
      strokeOpacity="0.7"
      strokeWidth="1"
      strokeDasharray="3 4"
      transform="rotate(-90 150 150)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
  const handleBar = (x1: number, y1: number, x2: number, y2: number, d: number) => (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d, duration: 0.3 }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c6f31a" strokeWidth="1.5" />
      {[
        [x1, y1],
        [(x1 + x2) / 2, (y1 + y2) / 2],
        [x2, y2],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill="#c6f31a" />
      ))}
    </motion.g>
  );
  return (
    <svg viewBox="0 0 300 300" className="h-56 w-56" aria-hidden>
      {[60, 110, 190, 240].map((v) => (
        <g key={v} stroke="#f8f8f8" strokeOpacity="0.12" strokeDasharray="2 5">
          <line x1={v} y1="10" x2={v} y2="290" />
          <line x1="10" y1={v} x2="290" y2={v} />
        </g>
      ))}
      {ring(100, 0)}
      {ring(48, 0.25)}
      {handleBar(110, 50, 190, 50, 0.5)}
      {handleBar(110, 250, 190, 250, 0.6)}
      {handleBar(50, 110, 50, 190, 0.7)}
      {handleBar(250, 110, 250, 190, 0.8)}
      <motion.text
        x="150"
        y="156"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="20"
        fill="#f8f8f8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        B<tspan fill="#c6f31a">X</tspan>
      </motion.text>
    </svg>
  );
}
