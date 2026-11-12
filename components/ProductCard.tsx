"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import BeyIllustration from "./BeyIllustration";
import type { Product } from "@/lib/products";
import { TYPE_BY_ID } from "@/lib/beyTypes";

export default function ProductCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const type = TYPE_BY_ID[product.type];
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`View details for ${product.name} ${product.config}`}
        style={{ "--glow": type.glow } as React.CSSProperties}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-steel text-left ring-1 ring-cream/5 transition-[background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:bg-gunmetal hover:shadow-[0_30px_70px_-28px_var(--glow)] hover:ring-cream/15 motion-reduce:hover:translate-y-0"
      >
        <div className="relative aspect-square overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-80"
            style={{ background: `radial-gradient(circle at 50% 60%, ${type.color}55, transparent 62%)` }}
          />
          {/* design-tool frame on hover */}
          <div className="pointer-events-none absolute inset-[9%] border border-dashed border-cream/0 transition-colors duration-500 group-hover:border-cream/40">
            {["left-0 top-0", "right-0 top-0", "left-0 bottom-0", "right-0 bottom-0"].map((p) => (
              <span
                key={p}
                className={`absolute h-1.5 w-1.5 bg-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${p} ${
                  p.includes("right") ? "translate-x-1/2" : "-translate-x-1/2"
                } ${p.includes("bottom") ? "translate-y-1/2" : "-translate-y-1/2"}`}
              />
            ))}
          </div>
          <div className="absolute inset-[13%] transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-[-120deg] group-hover:scale-[1.04]">
            {product.image ? (
              <Image
                src={product.image}
                alt={`${product.name} ${product.config} — official product photo`}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 520px"
                className="object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]"
              />
            ) : (
              <BeyIllustration visual={product.visual} title={`${product.name} ${product.config} illustration`} />
            )}
          </div>
          <span className="label absolute left-4 top-4 flex items-center gap-2 text-cream/80">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: type.color }} />
            {type.name}
          </span>
          <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-cream/25 text-cream/70 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
            <ArrowUpRight size={15} />
          </span>
        </div>
        <div className="flex flex-1 items-end justify-between gap-3 px-5 pb-5">
          <div>
            <h3 className="font-display text-2xl font-semibold leading-tight text-cream">{product.name}</h3>
            <p className="label mt-1 text-cream/65">
              {product.ratchet} · {product.bit}
            </p>
          </div>
          <span className="font-display text-xl font-semibold text-accent">{product.config}</span>
        </div>
      </button>
    </motion.li>
  );
}
