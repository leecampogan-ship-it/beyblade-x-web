"use client";

import { useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";

/**
 * Keeps a scene smooth on slower GPUs and high-DPI screens: watches the frame rate and
 * lowers the canvas resolution when it drops, raising it again when there is headroom.
 * Place it inside a <Canvas>; it renders nothing itself.
 */
export default function AdaptiveQuality({ min = 0.75, max = 1.5 }: { min?: number; max?: number }) {
  const setDpr = useThree((s) => s.setDpr);
  const deviceDpr = typeof window === "undefined" ? 1 : window.devicePixelRatio;
  const top = Math.min(max, deviceDpr);

  return (
    <PerformanceMonitor
      factor={1}
      flipflops={3}
      onChange={({ factor }) => {
        // factor runs 0 → 1; map it onto [min, top] in steps of 0.25 to avoid constant resizing.
        const dpr = Math.round((min + (top - min) * factor) * 4) / 4;
        setDpr(Math.max(min, Math.min(top, dpr)));
      }}
      // After repeated up/down swings, settle on 1x (or the screen's own density if lower) instead of oscillating.
      onFallback={() => setDpr(Math.min(top, 1))}
    />
  );
}
