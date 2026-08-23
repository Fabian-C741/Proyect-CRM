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

    // Íconos locales SIEMPRE (cuadrados PNG válidos). PWABuilder rechaza
    // fotos JPG rectangulares; si más adelante se sube un ícono cuadrado
    // propio, se puede reactivar el fallback a pwa_icon_url aquí.
    return {
      name,
      short_name: name,
      description: 'Sistema de gestión y reservas para maquilladora profesional.',
      start_url: '/dashboard',
      display: 'standalone',
      background_color: '#0f172a',
      theme_color: '#ec4899',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }
}
