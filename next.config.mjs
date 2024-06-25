// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcMinify: true,
  },
  images: {
    domains: ['imagedelivery.net'], // ここにホスト名を追加
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
