"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ResolvedAnchor {
  /** DOM element rendered outside the Canvas, absolutely positioned at the wrapper's top-left. */
  el: HTMLElement | null | undefined;
  /** 3D object whose world position the label follows. */
  object?: THREE.Object3D | null;
  /** Fixed world position (used when no object is given). */
  position?: [number, number, number];
  /** Horizontal screen-space offset in pixels (keeps labels beside, not on top of, the object). */
  offsetX?: number;
}

/**
 * Projects 3D anchor points to screen space every frame and moves plain DOM labels to match.
 * A lightweight alternative to drei's <Html> that keeps labels in the normal React tree.
 * `resolve` is called every frame, so it can read refs safely.
 */
export default function ProjectedLabels({ resolve }: { resolve: () => ResolvedAnchor[] }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    // Shrink pixel offsets on narrow canvases so labels stay inside the viewport
    const k = Math.min(1, size.width / 640);
    for (const a of resolve()) {
      const el = a.el;
      if (!el) continue;
      if (a.object) a.object.getWorldPosition(v);
      else if (a.position) v.set(a.position[0], a.position[1], a.position[2]);
      else continue;
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width + (a.offsetX ?? 0) * k;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      el.style.visibility = v.z > 1 ? "hidden" : "visible";
    }
  });
  return null;
}
