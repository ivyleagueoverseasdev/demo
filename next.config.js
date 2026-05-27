/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
    // No Image Optimization worker on Cloudflare Pages free plan
    unoptimized: true,
  },
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;
