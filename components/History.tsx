"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { GENERATIONS } from "@/lib/history";
import { cn } from "@/lib/utils";

export default function History() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(GENERATIONS.length - 1, i));
    const panel = el.children[clamped] as HTMLElement | undefined;
    setIndex(clamped);
    if (panel) el.scrollTo({ left: panel.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  // Sync active index with manual scrolling / swiping
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const children = Array.from(el.children) as HTMLElement[];
        const center = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        children.forEach((c, i) => {
          const mid = c.offsetLeft - el.offsetLeft + c.clientWidth / 2;
          const d = Math.abs(mid - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollTo(index - 1);
    }
  };

  const current = GENERATIONS[index];

  return (
    <section id="history" className="relative overflow-hidden bg-void py-28 sm:py-40">
      <div
        className="pointer-events-none absolute inset-0 opacity-30 transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${current.color}33, transparent 60%)` }}
      />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index="01"
            eyebrow="History of Beyblade"
            title="Four generations."
            accent="One legacy."
            description="From plastic spinning tops to die-cast metal, exploding Burst systems and the high-speed X-Celerator Rail — explore how Beyblade evolved over more than two decades."
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous generation"
              className="grid h-12 w-12 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-accent hover:bg-accent hover:text-ink disabled:opacity-25"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollTo(index + 1)}
              disabled={index === GENERATIONS.length - 1}
              aria-label="Next generation"
              className="grid h-12 w-12 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:border-accent hover:bg-accent hover:text-ink disabled:opacity-25"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Timeline rail */}
        <div className="relative mt-12" role="tablist" aria-label="Beyblade generations">
          <div className="absolute left-0 right-0 top-[18px] border-t border-dashed border-cream/20" />
          <motion.div
            className="absolute left-0 top-[17px] h-[2px] bg-accent"
            animate={{ width: `${(index / GENERATIONS.length) * 100 + 2}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="relative grid grid-cols-4">
            {GENERATIONS.map((g, i) => (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={index === i}
                aria-controls={`gen-${g.id}`}
                onClick={() => scrollTo(i)}
                className="group flex flex-col items-start text-left"
              >
                <span
                  className={cn(
                    "label grid h-9 w-9 place-items-center rounded-full border transition-colors",
                    i <= index ? "border-accent bg-accent text-ink" : "border-cream/25 bg-void text-cream/50",
                  )}
                >
                  {g.index}
                </span>
                <span
                  className={cn(
                    "label mt-4 hidden sm:block",
                    index === i ? "text-cream" : "text-cream/40 group-hover:text-cream/70",
                  )}
                >
                  {g.name}
                </span>
                <span className="mt-1 hidden text-xs text-white/35 sm:block">{g.era}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal panels */}
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Generation details — use left and right arrow keys to navigate"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-6 sm:px-6 lg:px-[max(2.5rem,calc((100vw-100rem)/2+2.5rem))]"
      >
        {GENERATIONS.map((g, i) => (
          <article
            key={g.id}
            id={`gen-${g.id}`}
            role="tabpanel"
            aria-label={g.name}
            className={cn(
              "clip-corner relative grid w-[88vw] max-w-5xl shrink-0 snap-center grid-cols-1 overflow-hidden md:w-[78vw] md:grid-cols-[1fr_1.15fr]",
              g.highlight
                ? "bg-steel ring-1 ring-accent/50"
                : "bg-steel",
            )}
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[440px]">
              <Image
                src={g.image}
                alt={g.imageAlt}
                fill
                unoptimized
                sizes="(max-width: 768px) 88vw, 40vw"
                className={cn("object-cover transition-transform duration-[1.2s]", index === i ? "scale-100" : "scale-110")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-steel via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-steel/90" />
              <span
                className="label absolute left-5 top-5 rounded-full bg-void/70 px-3 py-1.5"
                aria-hidden
              >
                {g.index}
              </span>
              {g.highlight && (
                <span className="label absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-ink">
                  <Sparkles size={12} /> CURRENT GENERATION
                </span>
              )}
            </div>

            <div className="relative p-6 sm:p-8 lg:p-10">
              <p className="label" style={{ color: g.color }}>
                GENERATION {g.index} · {g.era}
              </p>
              <h3 className="headline mt-4 text-4xl text-cream sm:text-5xl">
                {g.name}
              </h3>
              <p className="mt-1 text-sm text-white/50">{g.tagline}</p>
              <p className="mt-5 text-base leading-relaxed text-cream/70">{g.description}</p>

              <h4 className="label mt-7 text-cream/45">Key innovations</h4>
              <ul className="mt-3 space-y-2">
                {g.innovations.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: g.color }} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                {g.series.map((s) => (
                  <span key={s} className="label rounded-full border border-cream/15 px-3 py-1.5 text-cream/60">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
        <div className="w-1 shrink-0" aria-hidden />
      </div>
      <p className="mx-auto mt-2 max-w-[1600px] px-5 text-xs text-white/35 sm:px-10">
        Years refer to the original Japanese releases by Takara Tomy; international releases often followed later.
      </p>
    </section>
  );
}
