import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const fallbackIcon = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=512&h=512&fit=crop&auto=format'
  let iconUrl = fallbackIcon
  let brandName = 'CRM Maquilladora'

  try {
    const admin = getSupabaseAdmin()
    const { data } = await (admin.from('site_settings') as any)
      .select('pwa_icon_url, brand_name')
      .not('pwa_icon_url', 'is', null)
      .limit(1)
      .maybeSingle()
    if (data?.pwa_icon_url) iconUrl = data.pwa_icon_url
    if (data?.brand_name) brandName = data.brand_name
  } catch {}

  const manifest = {
    name: brandName,
    short_name: brandName,
    description: 'Sistema de gestión y reservas para maquilladora profesional.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#ec4899',
    icons: [
      { src: iconUrl, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      { src: iconUrl, sizes: '192x192', type: 'image/png' },
    ],
  }

  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  })
}
