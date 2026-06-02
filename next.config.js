/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    // Cloudflare Pages free plan has no image optimization worker.
    // unoptimized=true serves images as-is — required for all CF Pages deployments.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;
