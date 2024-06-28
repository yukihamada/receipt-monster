// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcMinify: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'doceater.io',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
     },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
