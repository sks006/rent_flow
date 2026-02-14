/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.airbnb.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.airbnb.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.airbnb.ca',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.airbnb.com.au',
        pathname: '/**',
      },
    ],
  },
  // Migrated from experimental.serverComponentsExternalPackages
  serverExternalPackages: ['puppeteer-core', 'puppeteer'],
  // Keep webpack config for compatibility
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      child_process: false,
      puppeteer: false 
    };
    return config;
  },
  // Silence Turbopack root directory warnings
  experimental: {
    turbopack: {
      root: '..',
    },
  },
}

export default nextConfig
