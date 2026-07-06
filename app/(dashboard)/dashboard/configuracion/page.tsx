import { getCurrentUser } from '@/lib/dal/auth'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { Servicio, PortfolioItem, Testimonio, MenuItem, BloqueoHorario } from '@/lib/definitions'
import ConfiguracionClient from './ConfiguracionClient'

async function getConfigData(userId: string) {
  const admin = getSupabaseAdmin()
  const tbl = admin.from('site_settings') as any

  // Usar admin client para que el usuario vea TODOS los registros, incluidos los creados con otro user_id
  const [serviciosRes, portfolioRes, testimoniosRes, menuItemsRes, bloqueosRes] = await Promise.all([
    (admin.from('servicios') as any).select('*').order('orden', { ascending: true }),
    (admin.from('portfolio') as any).select('*').eq('user_id', userId).order('orden', { ascending: true }),
    (admin.from('testimonios') as any).select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    (admin.from('menu_items') as any).select('*').eq('user_id', userId).order('orden', { ascending: true }),
    (admin.from('bloqueos_horarios') as any).select('*').eq('user_id', userId).eq('activo', true).order('fecha', { ascending: false }),
  ])

  return {
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

  const { servicios, portfolio, testimonios, menuItems, bloqueos } = await getConfigData(user.id)

  return (
    <ConfiguracionClient
      user={{ id: user.id, email: user.email }}
      servicios={servicios}
      portfolio={portfolio}
      testimonios={testimonios}
      menuItems={menuItems}
      bloqueos={bloqueos}
    />
  )
}

