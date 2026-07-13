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

  // Silenciar advertencia de Taint API — no tiene efecto en producción
  // (headers se eliminaron porque interferían con route handlers en Vercel)

  // Headers globales: evitar cache del navegador en la landing
  async headers() {
    return [
      {
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ]
  },
}

export default nextConfig
