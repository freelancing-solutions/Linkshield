import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features
  experimental: {
    typedRoutes: true,
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable compression
  compress: true,

  // Image optimization
  images: {
    domains: ['api.linkshield.site'],
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
      '@/components': './src/components',
      '@/hooks': './src/hooks',
      '@/services': './src/services',
      '@/types': './src/types',
      '@/utils': './src/utils',
      '@/stores': './src/stores',
      '@/config': './src/config',
      '@/lib': './src/lib',
    };

    // Optimize bundle splitting for production
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // React and Next.js framework
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // UI libraries
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@radix-ui)[\\/]/,
            priority: 30,
          },
          // Data fetching
          query: {
            name: 'query',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@tanstack\/react-query|axios)[\\/]/,
            priority: 25,
          },
          // Form libraries
          forms: {
            name: 'forms',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react-hook-form|zod)[\\/]/,
            priority: 20,
          },
          // Commons
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
