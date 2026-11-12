/**
 * Public site URL, used for absolute links in metadata, the sitemap and robots.txt.
 * Set NEXT_PUBLIC_SITE_URL for a custom domain; on Vercel the production URL is detected
 * automatically. Falls back to localhost in development.
 */
const configured =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);

export const SITE_URL = (configured ?? "http://localhost:3000").replace(/\/+$/, "");

export const SITE_NAME = "Beyblade X Experience";
