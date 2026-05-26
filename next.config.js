/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
    // Required for Cloudflare Pages — no Image Optimization worker on free plan
    unoptimized: true,
  },
  reactStrictMode: true,
  // Required for @cloudflare/next-on-pages compatibility
  experimental: {
    // Ensures edge runtime pages (api routes) are built correctly
  },
  // Prevents Pages Router conflict with App Router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;
