import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is required to make Prisma Client work with Next.js App Router.
  serverExternalPackages: ["@prisma/client", "bcrypt"],
};

export default nextConfig;
