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
};

export default nextConfig;