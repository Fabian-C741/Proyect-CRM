import { getCurrentUser } from '@/lib/dal/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { SiteSettings, Servicio, PortfolioItem, Testimonio, MenuItem, BloqueoHorario } from '@/lib/definitions'
import ConfiguracionClient from './ConfiguracionClient'

async function getConfigData(userId: string) {
  const supabase = await createSupabaseServerClient()

  const [settingsRes, serviciosRes, portfolioRes, testimoniosRes, menuItemsRes, bloqueosRes] = await Promise.all([
    supabase.from('site_settings').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('servicios').select('*').eq('user_id', userId).order('orden', { ascending: true }),
    supabase.from('portfolio').select('*').eq('user_id', userId).order('orden', { ascending: true }),
    supabase.from('testimonios').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('menu_items').select('*').eq('user_id', userId).order('orden', { ascending: true }),
    supabase.from('bloqueos_horarios').select('*').eq('user_id', userId).eq('activo', true).order('fecha', { ascending: false }),
  ])

  return {
    settings: (settingsRes.data as SiteSettings | null) ?? null,
    servicios: (serviciosRes.data as Servicio[]) ?? [],
    portfolio: (portfolioRes.data as PortfolioItem[]) ?? [],
    testimonios: (testimoniosRes.data as Testimonio[]) ?? [],
    menuItems: (menuItemsRes.data as MenuItem[]) ?? [],
    bloqueos: (bloqueosRes.data as BloqueoHorario[]) ?? [],
  }
}

export default async function ConfiguracionPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const { settings, servicios, portfolio, testimonios, menuItems, bloqueos } = await getConfigData(user.id)

  return (
    <ConfiguracionClient
      user={{ id: user.id, email: user.email }}
      settings={settings}
      servicios={servicios}
      portfolio={portfolio}
      testimonios={testimonios}
      menuItems={menuItems}
      bloqueos={bloqueos}
    />
  )
}

