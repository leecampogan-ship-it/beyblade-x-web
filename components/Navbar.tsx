"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { SECTIONS, cn, type SectionId } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId>("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section indicator: the section crossing the middle band of the viewport
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        open ? "bg-void" : scrolled ? "bg-gradient-to-b from-void/90 via-void/50 to-transparent" : "bg-transparent",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-10">
        <a href="#home" aria-label="Beyblade X — back to top" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "label relative block py-1 transition-colors",
                  active === s.id ? "dotted-underline text-cream" : "text-cream/75 hover:text-cream",
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="label flex h-10 items-center gap-2 rounded-full border border-cream/30 px-4 text-cream lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={16} /> : <Menu size={16} />} {open ? "Close" : "Menu"}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden bg-void lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 pt-6">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "headline flex items-center justify-between border-b border-dashed border-white/15 py-5 text-4xl",
                      active === s.id ? "text-accent" : "text-white",
                    )}
                  >
                    {s.label}
                    <span className="label text-white/40">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
