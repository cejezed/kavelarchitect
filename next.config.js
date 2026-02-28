/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cloud.funda.nl',
      },
      {
        protocol: 'https',
        hostname: 'maps.google.com',
      },
      {
        protocol: 'https',
        hostname: 'www.kavelarchitect.nl',
      },
      {
        protocol: 'https',
        hostname: 'kavelarchitect.nl',
      },
      {
        protocol: 'https',
        hostname: 'ymwwydpywichbotrqwsy.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cms.kavelarchitect.nl',
      },
      {
        protocol: 'https',
        hostname: 'www.zwijsen.net',
      }
    ],
  },
  // Optimize CSS and JavaScript
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable compression
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/llm.txt',
        destination: '/llms.txt',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;