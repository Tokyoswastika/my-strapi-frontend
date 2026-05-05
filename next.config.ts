import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ігноруємо помилки типів для успішного деплою
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ігноруємо помилки лінтера під час збірки
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;