# Asset reference

This document lists every visual asset in the project and where it came from.

## Summary

- **Product photography is official** and comes from <https://beyblade.com/>. It is © Takara Tomy / Hasbro.
  It was added at the site owner's request, and the owner accepted that beyblade.com grants no reuse licence.
  If you receive a takedown request, delete `public/images/beyblades/` and remove the `image` /
  `packaging` fields in `lib/products.ts`. The site then falls back to its original procedural visuals.
- **Everything else is original**: the 3D models, diagrams, timeline illustrations and wordmark.

## Official product photography (`public/images/beyblades/`)

The top-view photos were cut out onto a transparent background, cropped and resized to ≤640 px WebP.
The packaging photos were resized to ≤800 px WebP. Nothing else was changed.

| File | Original source (beyblade.com, "Beys" section) |
| --- | --- |
| `sword-dran-3-60f.webp` | https://beyblade.com/assets/images/toys/group-1-1.webp |
| `arrow-wizard-4-80b.webp` | https://beyblade.com/assets/images/toys/group-2-1.webp |
| `scythe-incendio-4-60t.webp` | https://beyblade.com/assets/images/toys/group-3-1.webp |
| `helm-knight-3-80n.webp` | https://beyblade.com/assets/images/toys/group-4-1.webp |
| `soar-phoenix-9-60gf.webp` | https://beyblade.com/assets/images/toys/group-6-1.webp (cropped from set photo) |
| `steel-samurai-4-80t.webp` | https://beyblade.com/assets/images/toys/group-7-0.webp |
| `talon-ptera-3-80b.webp` | https://beyblade.com/assets/images/toys/group-8-1.webp |
| `knife-shinobi-4-80hn.webp` | https://beyblade.com/assets/images/toys/group-9-1.webp (cropped from dual-pack photo) |
| `keel-shark-3-80f.webp` | https://beyblade.com/assets/images/toys/group-9-1.webp (cropped from dual-pack photo) |
| `packaging/sword-dran-3-60f.webp` | https://beyblade.com/assets/images/toys/group-1-3.webp |
| `packaging/arrow-wizard-4-80b.webp` | https://beyblade.com/assets/images/toys/group-2-3.webp |
| `packaging/scythe-incendio-4-60t.webp` | https://beyblade.com/assets/images/toys/group-3-3.webp |
| `packaging/helm-knight-3-80n.webp` | https://beyblade.com/assets/images/toys/group-4-3.webp |
| `packaging/soar-phoenix-9-60gf.webp` | https://beyblade.com/assets/images/toys/group-6-3.webp |
| `packaging/steel-samurai-4-80t.webp` | https://beyblade.com/assets/images/toys/group-7-1.webp |
| `packaging/talon-ptera-3-80b.webp` | https://beyblade.com/assets/images/toys/group-8-2.webp |
| `packaging/knife-shinobi-keel-shark-dual-pack.webp` | https://beyblade.com/assets/images/toys/group-9-2.webp |

The 3D Beyblades map each top-view photo onto stacked layers above a procedural body
(`PhotoBlade` in `components/three/BeybladeModel.tsx`).

## 3D models (generated at runtime, no files)

| Asset | Source | Notes |
| --- | --- | --- |
| Beyblade X model (Blade / Ratchet / Bit) | Original — `components/three/BeybladeModel.tsx` | Procedural Three.js geometry, parameterised per product (`lib/products.ts` → `visual`). Inspired by the real Blade-Ratchet-Bit construction. |
| Xtreme Stadium + X-Celerator Rail | Original — `components/three/StadiumScene.tsx` | Procedural lathe bowl, instanced rail teeth, zone pockets. |
| Studio lighting / reflections | Original — `components/three/StudioLights.tsx` | Procedural Lightformers; no HDR files are downloaded. |

## Vector images (`/public`)

| File | Source | Used in |
| --- | --- | --- |
| `favicon.svg` | Original | Browser tab icon |
| `images/branding/beyblade-x-wordmark.svg` | Original custom wordmark (not the official logo artwork) | Available for reuse / sharing |
| `images/backgrounds/gen1-plastic.svg` | Original illustration | History — Generation 1 |
| `images/backgrounds/gen2-metal.svg` | Original illustration | History — Generation 2 |
| `images/backgrounds/gen3-burst.svg` | Original illustration | History — Generation 3 |
| `images/backgrounds/gen4-x.svg` | Original illustration | History — Generation 4 |
| `images/stadium/xtreme-stadium-diagram.svg` | Original diagram | Stadium section fallback (no WebGL) |

The illustrations were generated with a small script that uses the same blade-outline maths as the 3D
model (`lib/bladeShape.ts`). Product card images are rendered live as inline SVG by
`components/BeyIllustration.tsx`, so no per-product image files are needed.

## Generated at build time

| Asset | Source |
| --- | --- |
| `/opengraph-image` (PNG, 1200×630) | Original — `app/opengraph-image.tsx` (Next.js `ImageResponse`) |

## Fonts

| Font | Licence | Delivery |
| --- | --- | --- |
| Outfit | SIL Open Font License | `next/font/google` (self-hosted at build time) |
| DM Sans | SIL Open Font License | `next/font/google` (self-hosted at build time) |

## Icons

[Lucide](https://lucide.dev) icons via `lucide-react` (ISC licence).

## Adding more product photos

1. Save a transparent, square, top-down WebP under `public/images/beyblades/<id>.webp`.
2. Set `image` both on the product and inside its `visual` in `lib/products.ts`. Set `packaging` too if you have a box photo.
3. Add a row to this file with the original URL and the rights holder.

## Text and data sources

Product names, configurations and types follow Hasbro's English-language releases, checked against
Hasbro and retailer listings (e.g. shop.hasbro.com product pages, Entertainment Earth wave listings).
Takara Tomy equivalents are only shown where confidently known.
