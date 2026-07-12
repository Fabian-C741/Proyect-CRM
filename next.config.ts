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

  // --- Headers de seguridad solo para rutas de dashboard y auth ---
  async headers() {
    return [
      { source: '/dashboard/:path*', headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ]},
      { source: '/login', headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ]},
      { source: '/api/:path*', headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
      ]},
    ]
  },
}

export default nextConfig
