"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { PRODUCTS, type Product } from "@/lib/products";
import { TYPES } from "@/lib/beyTypes";
import type { PerformanceType } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | PerformanceType;

export default function Collection() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Product | null>(null);

  // Allow other sections (e.g. Types) to pre-filter the collection
  useEffect(() => {
    const onFilter = (e: Event) => {
      const type = (e as CustomEvent<PerformanceType>).detail;
      setFilter(type);
      setQuery("");
    };
    window.addEventListener("bx:filter", onFilter);
    return () => window.removeEventListener("bx:filter", onFilter);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (filter !== "all" && p.type !== filter) return false;
      if (!q) return true;
      return [p.name, p.config, p.blade, p.ratchet, p.bit, p.bitCode, p.type, p.takaraEquivalent ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: PRODUCTS.length };
    PRODUCTS.forEach((p) => (c[p.type] = (c[p.type] ?? 0) + 1));
    return c;
  }, []);

  const close = useCallback(() => setOpen(null), []);

  const filters: { id: Filter; label: string; color: string }[] = [
    { id: "all", label: "All", color: "#d6dde6" },
    ...TYPES.map((t) => ({ id: t.id as Filter, label: t.name, color: t.color })),
  ];

  return (
    <section id="collection" className="section-divider relative overflow-hidden bg-void py-24 sm:py-32">
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10">
        <SectionHeading
            index="06"
          eyebrow="The collection"
          title="Pick your"
          accent="Bey."
          description="Real Beyblade X releases. Filter by type, search by name or part, and open any one for photos, the retail box and a 3D view."
        />

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="group" aria-label="Filter by type">
            {filters.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "label shrink-0 rounded-full border px-4 py-2.5 transition-colors",
                    on ? "border-cream bg-cream text-ink" : "border-cream/20 text-cream/70 hover:border-cream/60 hover:text-cream",
                  )}
                >
                  {f.label} <span className="opacity-50">{counts[f.id] ?? 0}</span>
                </button>
              );
            })}
          </div>
          <label className="relative block w-full lg:w-80">
            <span className="sr-only">Search Beyblades</span>
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/65" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, ratchet or bit…"
              className="w-full rounded-full border border-cream/20 bg-transparent py-3 pl-11 pr-10 text-sm text-cream placeholder:text-cream/55 focus:border-cream/60 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-cream/65 hover:text-cream"
              >
                <X size={14} />
              </button>
            )}
          </label>
        </div>

        <p className="label mt-6 text-cream/60" aria-live="polite">
          Showing {results.length} of {PRODUCTS.length} Beyblades
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} onOpen={setOpen} />
            ))}
          </AnimatePresence>
        </ul>

        {results.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-cream/25 p-12 text-center">
            <p className="headline text-4xl text-cream">No Beyblades found</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className="label mt-5 rounded-full bg-cream px-5 py-2.5 text-ink"
            >
              RESET FILTERS
            </button>
          </div>
        )}

        <p className="mt-14 max-w-3xl text-sm leading-relaxed text-cream/60">
          Names and configurations follow the Hasbro (English-language) releases; Takara Tomy equivalents are listed
          where known. Product availability differs by region — check{" "}
          <a href="https://beyblade.com/" target="_blank" rel="noopener noreferrer" className="dotted-underline text-cream">
            beyblade.com
          </a>{" "}
          for the official line-up.
        </p>
      </div>

      <AnimatePresence>{open && <ProductModal key={open.id} product={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}
