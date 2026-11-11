import { ArrowUpRight } from "lucide-react";
import { SECTIONS } from "@/lib/utils";

/** Construction-line wordmark: the giant faded name with dotted guides and orange handles. */
function ConstructionWordmark() {
  const handles = (x: number, y: number, w: number, h: number) =>
    [
      [x, y],
      [x + w / 2, y],
      [x + w, y],
      [x, y + h / 2],
      [x + w, y + h / 2],
      [x, y + h],
      [x + w / 2, y + h],
      [x + w, y + h],
    ].map(([hx, hy], i) => <rect key={i} x={hx - 4} y={hy - 4} width="8" height="8" fill="#c6f31a" />);
  return (
    <svg viewBox="0 0 1600 300" className="w-full" role="img" aria-label="Beyblade X">
      <text
        x="800"
        y="242"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="270"
        letterSpacing="-8"
        fill="#f8f8f8"
        fillOpacity="0.06"
      >
        BEYBLADE X
      </text>
      {/* guides */}
      {[48, 152, 252].map((y) => (
        <line key={y} x1="0" y1={y} x2="1600" y2={y} stroke="#f8f8f8" strokeOpacity="0.12" strokeDasharray="3 7" />
      ))}
      {/* frame around the X */}
      <rect x="1338" y="48" width="200" height="204" fill="none" stroke="#f8f8f8" strokeOpacity="0.5" strokeDasharray="4 5" />
      {handles(1338, 48, 200, 204)}
      <circle cx="1438" cy="150" r="128" fill="none" stroke="#f8f8f8" strokeOpacity="0.3" strokeDasharray="3 6" className="motion-safe:animate-dash" />
      {/* frame around the B */}
      <rect x="62" y="48" width="170" height="204" fill="none" stroke="#f8f8f8" strokeOpacity="0.35" strokeDasharray="4 5" />
      {handles(62, 48, 170, 204)}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="warm-glow relative overflow-hidden bg-void">
      <div className="mx-auto max-w-[1600px] px-5 pt-24 sm:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="eyebrow">Thanks for scrolling</p>
            <p className="headline mt-5 text-[clamp(2.6rem,6vw,5.5rem)]">
              <span className="text-cream/40">Now go</span>
              <br />
              let it rip.
            </p>
            <a
              href="#home"
              className="label mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-ink transition-colors hover:bg-accent"
            >
              Back to the top <ArrowUpRight size={14} />
            </a>
          </div>
          <nav aria-label="Footer">
            <h2 className="label text-cream/40">Explore</h2>
            <ul className="mt-5 space-y-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="font-display text-2xl font-medium text-cream/80 transition-colors hover:text-accent">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="label text-cream/40">Official website</h2>
            <a
              href="https://beyblade.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-display text-2xl font-medium text-cream/80 transition-colors hover:text-accent"
            >
              beyblade.com <ArrowUpRight size={18} />
            </a>
            <p className="mt-2 text-sm text-cream/45">For official products, rules and events.</p>
          </div>
        </div>

        <div className="mt-24">
          <ConstructionWordmark />
        </div>
      </div>

      <div className="border-t border-dashed border-cream/15">
        <div className="mx-auto max-w-[1600px] space-y-2 px-5 py-6 text-xs leading-relaxed text-cream/40 sm:px-10">
          <p>
            <strong className="text-cream/60">Disclaimer:</strong> This website is an independent educational fan project.
            It is not affiliated with, sponsored by or endorsed by Takara Tomy, Hasbro or any of their affiliates.
          </p>
          <p>
            BEYBLADE, BEYBLADE X and related names and marks are trademarks of their respective owners (including Takara
            Tomy and Hasbro), used here for identification and educational purposes only. Product photography ©
            Takara Tomy / Hasbro, sourced from beyblade.com. 3D models, diagrams and other illustrations are original
            fan-made artwork.
          </p>
          <p>© {new Date().getFullYear()} Beyblade X Fan Experience.</p>
        </div>
      </div>
    </footer>
  );
}
