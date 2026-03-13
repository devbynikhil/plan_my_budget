/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Optimize for production builds
  swcMinify: true,
  
  // Enable experimental features for better performance
  experimental: {
    // Enable server components
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
    // Fix Edge Runtime eval issues
    esmExternals: 'loose',
    serverMinification: false,
  },
  
  // Skip static generation for dynamic routes during build
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // Skip build-time data collection for API routes
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Image optimization for Docker
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Webpack configuration to fix Edge Runtime issues
  webpack: (config, { isServer, nextRuntime }) => {
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pg-native': false,
      };
    }
    return config;
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
