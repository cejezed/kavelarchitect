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
      }
    ],
  },
};

module.exports = nextConfig;