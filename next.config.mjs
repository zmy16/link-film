import path from "node:path";

const nextConfig = {
  // Explicit workspace root: this repo may be checked out alongside nested
  // worktrees that each carry a package-lock.json, which confuses Turbopack's
  // root inference ("multiple lockfiles detected" warning).
  turbopack: {
    root: path.join(process.cwd()),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128],
  },
};

export default nextConfig;
