"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Two-tone section heading: a small orange label with an index, then a large geometric
 * uppercase title whose first line is muted and second line is bright.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  tone = "dark",
  stacked = false,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  tone?: "dark" | "light";
  /** Stack description under the title (for headings placed in narrow columns). */
  stacked?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={cn("relative grid grid-cols-1 gap-8", !stacked && "lg:grid-cols-[1.4fr_1fr] lg:items-end", className)}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className={cn("eyebrow", light && "!text-ink before:!bg-ink")}>
          {index && <span className="opacity-60">({index})</span>} {eyebrow}
        </p>
        <h2 className={cn("headline mt-5 text-[clamp(2.6rem,6.2vw,6rem)]", light ? "text-ink" : "text-cream")}>
          <span className={light ? "text-ink/40" : "text-cream/40"}>{title}</span>
          {accent && (
            <>
              <br />
              {accent}
            </>
          )}
        </h2>
      </motion.div>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn("max-w-md font-display text-xl font-medium leading-snug", light ? "text-ink/75" : "text-cream/80")}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
