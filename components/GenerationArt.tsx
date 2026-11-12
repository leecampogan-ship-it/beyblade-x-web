import { useId } from "react";
import { bladePath } from "@/lib/bladeShape";

/**
 * Top-down artwork for each Beyblade generation, drawn with the same blade-shape generator as the
 * product illustrations so the History cards match the rest of the site. Each era gets one signature
 * detail: matte plastic, a die-cast metal wheel, a top bursting apart, and the X gear rail.
 */
export default function GenerationArt({ id, color, label, photo }: { id: string; color: string; label: string; photo?: string }) {
  const uid = useId().replace(/:/g, "");
  const year = label.slice(0, 4);
  const cx = 400;
  const cy = 300;

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id={`bg-${uid}`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0" stopColor={color} stopOpacity="0.32" />
          <stop offset="0.55" stopColor={color} stopOpacity="0.06" />
          <stop offset="1" stopColor="#070707" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`metal-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#aeb8c6" />
          <stop offset="0.55" stopColor="#4f5967" />
          <stop offset="0.8" stopColor="#e3e8ee" />
          <stop offset="1" stopColor="#8c97a6" />
        </linearGradient>
        <radialGradient id={`tint-${uid}`} cx="0.38" cy="0.32" r="0.85">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="0.35" stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0.7" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill="#0b0c0a" />
      <rect width="800" height="600" fill={`url(#bg-${uid})`} />

      {/* Era year, huge and faint behind the top */}
      <text
        x="400"
        y="560"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontSize="250"
        fill="none"
        stroke={color}
        strokeOpacity="0.16"
        strokeWidth="2"
      >
        {year}
      </text>

      {/* Stadium rings */}
      <g fill="none" stroke="#f8f8f8">
        {[150, 205, 260].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} strokeOpacity={0.09 - i * 0.02} strokeDasharray={i === 1 ? "3 9" : undefined} />
        ))}
      </g>

      {photo ? (
        // A real product photo replaces the drawn top (it has a transparent background and its own soft shadow)
        <image href={photo} x={cx - 190} y={cy - 175} width="380" height="350" />
      ) : (
        <>
          {id === "bakuten" && <Plastic cx={cx} cy={cy} uid={uid} />}
          {id === "metal" && <Metal cx={cx} cy={cy} uid={uid} />}
          {id === "burst" && <Burst cx={cx} cy={cy} uid={uid} color={color} />}
          {id === "x" && <XGen cx={cx} cy={cy} uid={uid} color={color} />}
        </>
      )}
    </svg>
  );
}

/** Rounds computed SVG coordinates so server and client render identical attributes (avoids hydration mismatches). */
const r2 = (n: number) => Math.round(n * 100) / 100;

type P = { cx: number; cy: number; uid: string; color?: string };

/** Gen 1: chunky, matte plastic attack ring around a bit-chip. */
function Plastic({ cx, cy, uid }: P) {
  return (
    <g>
      <path d={bladePath("balance", 3, 128, cx, cy)} fill={`url(#tint-${uid})`} stroke="#3a1d08" strokeWidth="3" />
      <path d={bladePath("balance", 3, 96, cx, cy)} fill="#c8743a" opacity="0.55" />
      <circle cx={cx} cy={cy} r="58" fill="#2b2f36" stroke="#111" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="38" fill="#e04b3a" stroke="#111" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="14" fill="#f4e3c9" />
      <ellipse cx={cx - 50} cy={cy - 58} rx="40" ry="12" fill="#fff" opacity="0.18" transform={`rotate(-30 ${cx - 50} ${cy - 58})`} />
    </g>
  );
}

/** Gen 2: heavy die-cast fusion wheel under a clear energy ring and face bolt. */
function Metal({ cx, cy, uid }: P) {
  return (
    <g>
      <path d={bladePath("defense", 6, 140, cx, cy)} fill={`url(#metal-${uid})`} stroke="#1b2130" strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={r2(cx + Math.cos(a) * 86)}
            y1={r2(cy + Math.sin(a) * 86)}
            x2={r2(cx + Math.cos(a) * 128)}
            y2={r2(cy + Math.sin(a) * 128)}
            stroke="#1b2130"
            strokeOpacity="0.35"
            strokeWidth="3"
          />
        );
      })}
      <circle cx={cx} cy={cy} r="80" fill="#9fd8ff" fillOpacity="0.28" stroke="#dff3ff" strokeOpacity="0.6" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="42" fill="#1f2a3a" stroke="#c9d3df" strokeWidth="4" />
      <circle cx={cx} cy={cy} r="24" fill="#3a6fd8" />
      <ellipse cx={cx - 60} cy={cy - 70} rx="48" ry="12" fill="#fff" opacity="0.3" transform={`rotate(-32 ${cx - 60} ${cy - 70})`} />
    </g>
  );
}

/** Gen 3: a layer, disc and driver flying apart mid-burst. */
function Burst({ cx, cy, uid, color = "#7b2ff7" }: P) {
  const pieces = [
    { dx: -70, dy: -40, rot: -18, d: bladePath("attack", 2, 60, 0, 0) },
    { dx: 75, dy: -30, rot: 25, d: bladePath("attack", 2, 54, 0, 0) },
    { dx: 0, dy: 70, rot: 8, d: bladePath("balance", 3, 50, 0, 0) },
  ];
  return (
    <g>
      {/* burst flash */}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2 + 0.2;
        return (
          <line
            key={i}
            x1={r2(cx + Math.cos(a) * 70)}
            y1={r2(cy + Math.sin(a) * 70)}
            x2={r2(cx + Math.cos(a) * (190 + (i % 3) * 40))}
            y2={r2(cy + Math.sin(a) * (190 + (i % 3) * 40))}
            stroke={color}
            strokeOpacity="0.45"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      {pieces.map((p, i) => (
        <g key={i} transform={`translate(${cx + p.dx * 1.5} ${cy + p.dy * 1.5}) rotate(${p.rot})`}>
          <path d={p.d} fill={i === 2 ? `url(#metal-${uid})` : `url(#tint-${uid})`} stroke="#120a20" strokeWidth="3" />
          <circle r="16" fill="#111" opacity="0.6" />
        </g>
      ))}
      {/* core driver */}
      <circle cx={cx} cy={cy} r="30" fill="#24262c" stroke="#d6dde6" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="10" fill={color} />
    </g>
  );
}

/** Gen 4: the real Sword Dran photo inside the gear-toothed rail, with Xtreme Dash speed streaks. */
function XGen({ cx, cy, color = "#18d4ff" }: P) {
  const teeth = 64;
  return (
    <g>
      {/* gear rail */}
      <circle cx={cx} cy={cy} r="232" fill="none" stroke="#c6f31a" strokeOpacity="0.85" strokeWidth="4" />
      {Array.from({ length: teeth }).map((_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={r2(cx + Math.cos(a) * 234)}
            y1={r2(cy + Math.sin(a) * 234)}
            x2={r2(cx + Math.cos(a) * 250)}
            y2={r2(cy + Math.sin(a) * 250)}
            stroke="#c6f31a"
            strokeOpacity="0.85"
            strokeWidth="5"
          />
        );
      })}
      {/* dash streaks */}
      {[-40, -14, 12, 38].map((o, i) => (
        <line key={o} x1={cx - 330 + i * 18} y1={cy + o} x2={cx - 150} y2={cy + o} stroke={color} strokeOpacity={0.5 - i * 0.08} strokeWidth="5" strokeLinecap="round" />
      ))}
      {/* the current generation: the real Sword Dran product photo */}
      <circle cx={cx} cy={cy} r="150" fill={color} opacity="0.12" />
      <image href="/images/beyblades/sword-dran-3-60f.webp" x={cx - 150} y={cy - 150} width="300" height="300" />
    </g>
  );
}
