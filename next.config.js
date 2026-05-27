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
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === 'edge') {
      // async_hooks is a Node.js built-in that @cloudflare/next-on-pages cannot
      // bundle for the edge. Stub it out so the bundler doesn't crash trying to
      // resolve it as a local file.
      config.resolve.alias = {
        ...config.resolve.alias,
        async_hooks: false,
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
      };
    }
    return config;
  },
  // Prevents Pages Router conflict with App Router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;
