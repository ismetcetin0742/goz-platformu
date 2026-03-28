import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is required to make Prisma Client work with Next.js App Router.
  serverExternalPackages: ["@prisma/client", "bcrypt"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
