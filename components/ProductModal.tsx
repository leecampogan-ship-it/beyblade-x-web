"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "motion/react";
import { Box, ImageIcon, Package, X, ZoomIn, ZoomOut } from "lucide-react";
import BeyIllustration from "./BeyIllustration";
import SceneShell from "./three/SceneShell";
import SceneLoader from "./three/SceneLoader";
import type { Product } from "@/lib/products";
import { BIT_GLOSSARY } from "@/lib/products";
import { TYPE_BY_ID } from "@/lib/beyTypes";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

const MiniBeyScene = dynamic(() => import("./three/MiniBeyScene"), {
  ssr: false,
  loading: () => <SceneLoader />,
});

export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const reduced = usePrefersReducedMotion();
  const type = TYPE_BY_ID[product.type];
  const [view, setView] = useState<"3d" | "image" | "box">(product.image ? "image" : "3d");
  const [zoom, setZoom] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  const specs: [string, string][] = [
    ["Type", type.name],
    ["Blade", product.blade],
    ["Ratchet", `${product.ratchet} (${product.visual.ratchetProtrusions} protrusions · ${product.visual.ratchetHeight.toFixed(1)} mm)`],
    ["Bit", `${product.bit} (${product.bitCode})`],
    ["Spin", `${product.spin}-spin`],
    ["Release", product.release],
  ];
  if (product.takaraEquivalent) specs.push(["Takara Tomy equivalent", product.takaraEquivalent]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92dvh] w-full max-w-5xl grid-cols-1 overflow-y-auto rounded-t-2xl bg-charcoal sm:rounded-2xl md:grid-cols-2"
        style={{ boxShadow: `0 0 80px -20px ${type.color}` }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream text-ink hover:bg-accent"
        >
          <X size={18} />
        </button>

        <div
          className={cn("relative transition-all duration-500", zoom ? "h-[70dvh] md:col-span-2" : "h-[320px] md:h-auto md:min-h-[480px]")}
          style={{ background: `radial-gradient(circle at 50% 55%, ${type.color}30, #05060a 70%)` }}
        >
          {view === "3d" ? (
            <SceneShell
              rootMargin="0px"
              fallback={
                <div className="flex h-full items-center justify-center p-10">
                  <BeyIllustration visual={product.visual} spinning={!reduced} className="max-w-[320px]" />
                </div>
              }
            >
              {(active) => <MiniBeyScene active={active} visual={product.visual} reduced={reduced} glowColor={type.color} />}
            </SceneShell>
          ) : view === "box" && product.packaging ? (
            <div className="relative h-full w-full bg-white">
              <Image
                src={product.packaging}
                alt={`${product.name} ${product.config} retail packaging`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              {product.image ? (
                <div className="relative h-full w-full">
                  <Image src={product.image} alt={`${product.name} ${product.config} — official product photo`} fill sizes="90vw" className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)]" />
                </div>
              ) : (
                <BeyIllustration
                  visual={product.visual}
                  className={zoom ? "max-w-[min(70dvh,90vw)]" : "max-w-[340px]"}
                  title={`${product.name} ${product.config} illustration`}
                />
              )}
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button
              type="button"
              onClick={() => setView("3d")}
              aria-pressed={view === "3d"}
              className={cn("label inline-flex items-center gap-1.5 rounded-full border px-3 py-2", view === "3d" ? "border-accent bg-accent text-ink" : "border-white/20 bg-black/50 text-white/60")}
            >
              <Box size={12} /> 3D
            </button>
            <button
              type="button"
              onClick={() => setView("image")}
              aria-pressed={view === "image"}
              className={cn("label inline-flex items-center gap-1.5 rounded-full border px-3 py-2", view === "image" ? "border-accent bg-accent text-ink" : "border-white/20 bg-black/50 text-white/60")}
            >
              <ImageIcon size={12} /> PHOTO
            </button>
            {product.packaging && (
              <button
                type="button"
                onClick={() => setView("box")}
                aria-pressed={view === "box"}
                className={cn("label inline-flex items-center gap-1.5 rounded-full border px-3 py-2", view === "box" ? "border-accent bg-accent text-ink" : "border-white/20 bg-black/50 text-white/60")}
              >
                <Package size={12} /> BOX
              </button>
            )}
            <button
              type="button"
              onClick={() => setZoom((z) => !z)}
              aria-pressed={zoom}
              aria-label={zoom ? "Shrink view" : "Enlarge view"}
              className="label inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-white/80"
            >
              {zoom ? <ZoomOut size={12} /> : <ZoomIn size={12} />} {zoom ? "SHRINK" : "ENLARGE"}
            </button>
          </div>
        </div>

        <div className={cn("p-6 sm:p-8", zoom && "md:col-span-2")}>
          <span className="inline-block px-2 py-1 font-display text-xs font-bold tracking-wider text-black" style={{ background: type.color }}>
            {type.name.toUpperCase()} TYPE
          </span>
          <h3 id="product-title" className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
            {product.name}
          </h3>
          <p className="font-display text-xl font-bold" style={{ color: type.color }}>
            {product.config}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{product.description}</p>

          <dl className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-3 py-2.5 text-sm">
                <dt className="text-[11px] uppercase tracking-[0.15em] text-white/45">{k}</dt>
                <dd className="text-white/85">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-white/50">
            <strong className="text-white/70">About the {product.bit} bit:</strong> {BIT_GLOSSARY[product.bitCode]?.summary}
          </p>
          <p className="mt-4 text-[11px] text-white/35">
            Product photography © Takara Tomy / Hasbro, from the official site beyblade.com. The 3D view is a
            fan-made model using the official top-view photo.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
