import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Resolves absolute URLs for social images. Set NEXT_PUBLIC_SITE_URL for a custom domain;
// on Vercel the production URL is detected automatically.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);

const title = "BEYBLADE X — Accelerate Your Game | Interactive 3D Fan Experience";
const description =
  "An immersive, interactive 3D guide to Beyblade X: explore the history of Beyblade, break down the Blade, Ratchet and Bit, learn the four performance types, watch the X-Celerator Rail in action and browse the collection.";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title,
  description,
  applicationName: "Beyblade X Experience",
  keywords: [
    "Beyblade X",
    "Beyblade",
    "X-Celerator Rail",
    "Xtreme Dash",
    "Blade Ratchet Bit",
    "Beyblade history",
    "Beyblade types",
    "Xtreme Stadium",
  ],
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable}`}>
      <body>
        <noscript>
          <style>{`[data-loader]{display:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
