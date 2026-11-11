# BEYBLADE X — Interactive 3D Fan Experience

An immersive, single-page educational fan website about **Beyblade X**, built with Next.js, React Three
Fiber and Tailwind CSS. Everything is static and runs fully in the browser: no backend, database or API
keys are needed.

> Independent educational fan project — not affiliated with, sponsored by or endorsed by Takara Tomy or
> Hasbro. See [ASSETS.md](./ASSETS.md) for the source of every visual asset.

## Features

| Section | What it does |
| --- | --- |
| **Story hero** | A pinned, scroll-driven 3D story: Sword Dran sits on a cutting mat, then rises, tilts, splits into Blade / Ratchet / Bit inside dotted "design tool" frames, and rips at full speed, while the copy reveals word by word. The timeline lives in `lib/story.ts`. |
| **History** | Horizontal, swipeable timeline of the four generations (arrow buttons, timeline nodes, keyboard arrows). |
| **About** | Beginner explainer with animated SVG diagrams of the X-Celerator Rail and the gear mechanism. |
| **Parts** | Interactive 3D exploded view: assemble/separate, click parts, floating labels, info panel, model selector. |
| **Types** | Attack / Defense / Stamina / Balance tabs, each with a 3D preview, strengths, weaknesses, strategy and examples. Radar chart and table comparison. |
| **Stadium** | 3D Xtreme Stadium with an animated battle: Xtreme Dash along a lit rail, collision sparks, and Xtreme / Over / Burst / Spin finish demonstrations (play, pause, replay). |
| **Collection** | Filterable, searchable product grid with a detail modal (3D view, enlarge, specs). |

It also includes a sticky navigation bar with active-section highlighting, a mobile menu, a back-to-top
button, a loading screen, `prefers-reduced-motion` support, WebGL fallbacks and error boundaries.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) · React 19 · TypeScript
- Tailwind CSS v4
- three.js · @react-three/fiber · @react-three/drei
- Motion (`motion/react`, formerly Framer Motion)
- lucide-react icons
- Lenis smooth scrolling (turned off when the user prefers reduced motion)

## Getting started

Requires **Node.js 20.9 or newer**.

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # create a production build
npm start        # serve the production build
```

Other scripts:

```bash
npm run lint       # ESLint (Next.js core-web-vitals + TypeScript rules)
npm run typecheck  # TypeScript, no emit
```

Tip: add `?no3d` to the URL (e.g. `http://localhost:3000/?no3d`) to preview the non-WebGL fallback.

## Deploying to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Beyblade X website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. **Import into Vercel.** Go to <https://vercel.com/new>, choose **Import Git Repository**, and pick the repo.
3. **Settings.** Vercel detects the **Next.js** framework preset automatically. Leave the defaults:
   - Build command: `next build` (or `npm run build`)
   - Output directory: *(default)*
   - Install command: `npm install`
   - No environment variables are required.
4. Click **Deploy**. Each later push to `main` redeploys automatically.

**Optional:** for a custom domain, set `NEXT_PUBLIC_SITE_URL` (e.g. `https://beyblade-x.example.com`) so
social-share images use absolute URLs. On Vercel the production URL is detected automatically.

## Project structure

```
app/
  layout.tsx            Root layout, fonts, SEO metadata
  page.tsx              Composes all sections
  globals.css           Tailwind v4 theme tokens and utilities
  opengraph-image.tsx   Generated social-share image
components/
  Navbar, Hero, History, AboutBeybladeX, PartsBreakdown, BeybladeTypes,
  Stadium, Collection, ProductCard, ProductModal, Footer, LoadingScreen,
  BackToTop, Logo, SectionHeading, BeyIllustration
  three/
    BeybladeModel.tsx   Procedural Blade / Ratchet / Bit model (explode, burst, highlight)
    StoryScene.tsx      Scroll-driven 3D scene for the story hero
    ExplodedView.tsx    Parts breakdown scene
    MiniBeyScene.tsx    Small spinning preview (types, product modal)
    StadiumScene.tsx    Stadium + scripted battle animation
    ProjectedLabels.tsx DOM labels that track 3D points
    SceneShell.tsx      Lazy mount, off-screen pause, WebGL fallback, error boundary
    StudioLights.tsx    Procedural lighting / reflections (no HDR downloads)
lib/
  products.ts   Product catalogue (edit here to add Beyblades)
  history.ts    Generation timeline content
  beyTypes.ts   Performance-type content
  bladeShape.ts Shared blade-outline maths (3D and SVG)
public/
  images/       Original SVG illustrations (see ASSETS.md)
  models/       Reserved for licensed GLB models (none needed)
```

## Adding a Beyblade to the collection

Append an entry to `PRODUCTS` in `lib/products.ts`:

```ts
{
  id: "my-bey-3-60f",
  name: "My Bey",
  config: "3-60F",
  type: "attack",                 // attack | defense | stamina | balance
  blade: "My Bey", ratchet: "3-60", bit: "Flat", bitCode: "F",
  spin: "Right",
  release: "Booster",
  description: "Short description…",
  // image: "/images/beyblades/my-bey.webp", // optional, licensed photo
  visual: {                        // drives the procedural 3D model + SVG
    bladeStyle: "attack", contactPoints: 3,
    primary: "#1e6bff", secondary: "#c9d3e0", accent: "#ffd23d",
    ratchetProtrusions: 3, ratchetHeight: 6, bit: "flat",
  },
}
```

Only add specifications you've verified. The filters, search, counts and type examples update automatically.

## Performance notes

- 3D scenes are code-split (`next/dynamic`, `ssr: false`), mount only when near the viewport, and pause
  their render loop when off-screen.
- Device pixel ratio is capped; product cards use lightweight SVG instead of one WebGL canvas per card.
- No HDR environment maps or model files are downloaded, because lighting and geometry are procedural.

## Accuracy notes

Product names and configurations follow Hasbro's English-language releases. Generation years refer to the
original Japanese launches. The type comparison values are an illustrative guide, not official statistics,
and the stadium animation is a simplified demonstration rather than a physics simulation.

## Legal

BEYBLADE, BEYBLADE X and related names are trademarks of their respective owners (including Takara Tomy
and Hasbro), used here for identification and educational purposes only. Visit the official site at
<https://beyblade.com/>.
