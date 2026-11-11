"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { hasWebGL } from "@/lib/utils";
import { cn } from "@/lib/utils";

const noop = () => () => {};

interface SceneShellProps {
  /** Rendered when WebGL is unavailable or the scene throws. */
  fallback: ReactNode;
  /** Render prop receiving `active` (true while on-screen) to pause the render loop off-screen. */
  children: (active: boolean) => ReactNode;
  className?: string;
  /** How far ahead of the viewport to mount the scene. */
  rootMargin?: string;
  label?: string;
}

/**
 * Lazily mounts a 3D scene once it approaches the viewport, pauses it when off-screen,
 * and falls back to a static illustration when WebGL is missing or a scene crashes.
 */
export default function SceneShell({ fallback, children, className, rootMargin = "300px" }: SceneShellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const webgl = useSyncExternalStore(noop, hasWebGL, () => true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={cn("relative h-full w-full", className)}>
      {!webgl ? (
        fallback
      ) : mounted ? (
        <ErrorBoundary fallback={fallback}>{children(active)}</ErrorBoundary>
      ) : null}
    </div>
  );
}
