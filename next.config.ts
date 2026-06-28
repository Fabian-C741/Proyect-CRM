import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // --- Seguridad: Taint API (previene pasar datos sensibles al cliente) ---
  experimental: {
    taint: true,
  },

  // --- Imágenes de Supabase Storage ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // --- Headers de seguridad adicionales para archivos estáticos ---
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
