import type { MetadataRoute } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getPwaData(): Promise<{ name: string; icono: string | null }> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('site_settings')
      .select('brand_name, pwa_icon_url, favicon_url')
      .limit(1)
      .maybeSingle()
    return {
      name: data?.brand_name || 'CRM Maquilladora',
      icono: data?.pwa_icon_url || data?.favicon_url || null,
    }
  } catch {
    return { name: 'CRM Maquilladora', icono: null }
  }
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { name, icono } = await getPwaData()

    // Si hay ícono personalizado se usa para todo; si no, fallback a los
    // íconos locales generados (siempre cuadrados y PNG válidos).
    const base = icono || '/icon-512.png'
    return {
      name,
      short_name: name,
      description: 'Sistema de gestión y reservas para maquilladora profesional.',
      start_url: '/dashboard',
      display: 'standalone',
      background_color: '#0f172a',
      theme_color: '#ec4899',
      icons: [
        { src: icono || '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: base, sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: base, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }
}
