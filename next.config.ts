import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'innermost-ke1is9rkm-darylhoggs-projects.vercel.app',
        '*.vercel.app',
      ],
    },
  },
}

export default nextConfig
