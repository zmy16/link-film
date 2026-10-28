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
    // The provider logos render between 95px and ~170px wide. Without the
    // middle sizes the browser had to jump from `sizes` straight to the 640px
    // device variant — several times the bytes for a small slot, and more work
    // for the optimizer on every uncached request.
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384],
  },
  /**
   * The provider logos never change between deploys, but Next serves anything
   * in `public/` with `max-age=0`, so every visit revalidated all seven. A week
   * of freshness (plus a revalidate window) keeps repeat visits instant
   * without making a swapped logo impossible to roll out.
   *
   * Only `public/logos/` needs this: the icon and OG image are file-based
   * metadata routes under `app/`, which Next already serves as immutable.
   */
  async headers() {
    return [
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
