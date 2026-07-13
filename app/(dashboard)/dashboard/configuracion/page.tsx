import { getCurrentUser } from '@/lib/dal/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { PortfolioItem, Testimonio, MenuItem, BloqueoHorario } from '@/lib/definitions'
import ConfiguracionClient from './ConfiguracionClient'

async function getConfigData(userId: string) {
  const supabase = await createSupabaseServerClient()

  const [portfolioRes, testimoniosRes, menuItemsRes, bloqueosRes] = await Promise.all([
    supabase.from('portfolio').select('*').eq('user_id', userId).order('orden', { ascending: true }),
    supabase.from('testimonios').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('menu_items').select('*').eq('user_id', userId).order('orden', { ascending: true }),
    supabase.from('bloqueos_horarios').select('*').eq('user_id', userId).eq('activo', true).order('fecha', { ascending: false }),
  ])

  let portfolio = (portfolioRes.data as PortfolioItem[]) ?? []

  if (portfolio.length === 0) {
    const ids: string[] = []
    for (const p of [
      { imagen_url: 'https://images.unsplash.com/photo-1512496015851-a1cbf39a5180?q=80&w=600&auto=format&fit=crop', descripcion: 'Maquillaje social de alta duración', orden: 0 },
      { imagen_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop', descripcion: 'Look para novia elegante', orden: 1 },
      { imagen_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop', descripcion: 'Curso de automaquillaje', orden: 2 },
    ]) {
      const { data } = await supabase.from('portfolio').insert({ user_id: userId, ...p }).select('id').single()
      if (data) ids.push(data.id)
    }
    if (ids.length > 0) {
      const { data: fetched } = await supabase.from('portfolio').select('*').in('id', ids)
      portfolio = (fetched as PortfolioItem[]) ?? []
    }
  }

  return {
    portfolio,
    testimonios: (testimoniosRes.data as Testimonio[]) ?? [],
    menuItems: (menuItemsRes.data as MenuItem[]) ?? [],
    bloqueos: (bloqueosRes.data as BloqueoHorario[]) ?? [],
  }
}

export default async function ConfiguracionPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const data = await getConfigData(user.id)

  return (
    <ConfiguracionClient
      user={{ id: user.id, email: user.email }}
      portfolio={data.portfolio}
      testimonios={data.testimonios}
      menuItems={data.menuItems}
      bloqueos={data.bloqueos}
    />
  )
}

