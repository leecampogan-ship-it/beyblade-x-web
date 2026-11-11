import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Raster images placed in /public/images are served as AVIF/WebP automatically.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
