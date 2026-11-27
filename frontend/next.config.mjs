import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  devIndicators: false,
  reactStrictMode: true,
  // Force a fresh unique build ID on every build so browser cache never reuses stale compiled chunks
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  async headers() {
    return [
      {
        // Apply no-cache headers to all HTML pages and data routes to prevent browsers from caching stale page bundles
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

