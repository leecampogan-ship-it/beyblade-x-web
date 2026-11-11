"use client";

import { useId } from "react";
import Image from "next/image";
import type { BeyVisual } from "@/lib/types";
import { bladePath } from "@/lib/bladeShape";
import { cn } from "@/lib/utils";

/**
 * Original top-down vector illustration of a Beyblade, generated from the same
 * parameters as the 3D model. Used for product cards and as the WebGL fallback.
 */
export default function BeyIllustration({
  visual,
  className,
  spinning = false,
  title,
}: {
  visual: BeyVisual;
  className?: string;
  spinning?: boolean;
  title?: string;
}) {
  const id = useId().replace(/:/g, "");
  const sizeClass = cn("block aspect-square", !/(^|\s)w-/.test(className ?? "") && "w-full", className);

  // Official product photo when available
  if (visual.image) {
    return (
      <span className={cn("relative", sizeClass)}>
        <Image
          src={visual.image}
          alt={title ?? ""}
          aria-hidden={title ? undefined : true}
          fill
          sizes="(max-width: 640px) 80vw, 420px"
          className={cn(
            "object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]",
            spinning && "animate-[spin_1.2s_linear_infinite] motion-reduce:animate-none",
          )}
        />
      </span>
    );
  }

  const metal = bladePath(visual.bladeStyle, visual.contactPoints, 92, 100, 100);
  const cover = bladePath(visual.bladeStyle, visual.contactPoints, 74, 100, 100);

  return (
    <span className={sizeClass}>
    <svg
      viewBox="0 0 200 200"
      className="block h-full w-full"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={`m-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#aeb8c6" />
          <stop offset="0.55" stopColor="#5d6878" />
          <stop offset="0.8" stopColor="#dfe5ec" />
          <stop offset="1" stopColor="#8c97a6" />
        </linearGradient>
        <radialGradient id={`c-${id}`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.35" stopColor={visual.primary} />
          <stop offset="1" stopColor={visual.primary} stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id={`g-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.6" stopColor={visual.primary} stopOpacity="0.35" />
          <stop offset="1" stopColor={visual.primary} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill={`url(#g-${id})`} />
      <g
        className={spinning ? "origin-center animate-[spin_1.6s_linear_infinite] motion-reduce:animate-none" : undefined}
        style={{ transformBox: "fill-box" }}
      >
        <path d={metal} fill={`url(#m-${id})`} stroke="#1b2130" strokeWidth="1.2" />
        <path d={cover} fill={`url(#c-${id})`} stroke="rgba(0,0,0,0.45)" strokeWidth="1" />
        <circle cx="100" cy="100" r="44" fill="none" stroke={visual.secondary} strokeWidth="9" opacity="0.9" />
        <circle cx="100" cy="100" r="28" fill={visual.accent} stroke="#0b0d12" strokeWidth="2" />
        <g stroke="#0b0d12" strokeWidth="6" strokeLinecap="round">
          <line x1="88" y1="88" x2="112" y2="112" />
          <line x1="112" y1="88" x2="88" y2="112" />
        </g>
        <ellipse cx="80" cy="70" rx="22" ry="9" fill="#fff" opacity="0.18" transform="rotate(-30 80 70)" />
      </g>
    </svg>
    </span>
  );
}
