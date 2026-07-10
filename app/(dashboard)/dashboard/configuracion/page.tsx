import { getCurrentUser } from '@/lib/dal/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Servicio, PortfolioItem, Testimonio, MenuItem, BloqueoHorario } from '@/lib/definitions'
import ConfiguracionClient from './ConfiguracionClient'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

async function restInsert(table: string, body: any) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': anonKey, 'Authorization': `Bearer ${serviceKey}`, 'Prefer': 'return=representation' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return null
  const json = await res.json()
  return json?.[0]?.id ?? null
}

async function getConfigData(userId: string) {
  const supabase = await createSupabaseServerClient()

  // Servicios: sin filtro user_id para que el admin vea TODOS (incluidos los creados con otro id)
  // El resto: filtrados por user_id del usuario actual
  const [serviciosRes, portfolioRes, testimoniosRes, menuItemsRes, bloqueosRes] = await Promise.all([
    supabase.from('servicios').select('*').order('orden', { ascending: true }),
    supabase.from('portfolio').select('*').eq('user_id', userId).order('orden', { ascending: true }),
    supabase.from('testimonios').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('menu_items').select('*').eq('user_id', userId).order('orden', { ascending: true }),
    supabase.from('bloqueos_horarios').select('*').eq('user_id', userId).eq('activo', true).order('fecha', { ascending: false }),
  ])

  let servicios = (serviciosRes.data as Servicio[]) ?? []
  let portfolio = (portfolioRes.data as PortfolioItem[]) ?? []

  if (servicios.length === 0) {
    const defaults = [
      { nombre: 'Maquillaje Social', descripcion: 'Look perfecto y duradero para eventos, fiestas y reuniones importantes.', imagen_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=800&auto=format&fit=crop', precio: 0, duracion_minutos: 60, orden: 0 },
      { nombre: 'Maquillaje de Novia', descripcion: 'Prueba y maquillaje para el día más especial, con productos de alta gama.', imagen_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop', precio: 0, duracion_minutos: 90, orden: 1 },
      { nombre: 'Cursos de Automaquillaje', descripcion: 'Aprende a conocer tu rostro y las mejores técnicas para el día a día.', imagen_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop', precio: 0, duracion_minutos: 120, orden: 2 },
    ]
    const ids: string[] = []
    for (const s of defaults) {
      const id = await restInsert('servicios', { user_id: userId, ...s })
      if (id) ids.push(id)
    }
    if (ids.length > 0) {
      const { data: fetched } = await supabase.from('servicios').select('*').in('id', ids)
      servicios = (fetched as Servicio[]) ?? []
    }
  }

  if (portfolio.length === 0) {
    const defaults = [
      { imagen_url: 'https://images.unsplash.com/photo-1512496015851-a1cbf39a5180?q=80&w=600&auto=format&fit=crop', descripcion: 'Maquillaje social de alta duración', orden: 0 },
      { imagen_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop', descripcion: 'Look para novia elegante', orden: 1 },
      { imagen_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop', descripcion: 'Curso de automaquillaje', orden: 2 },
    ]
    const ids: string[] = []
    for (const p of defaults) {
      const id = await restInsert('portfolio', { user_id: userId, ...p })
      if (id) ids.push(id)
    }
    if (ids.length > 0) {
      const { data: fetched } = await supabase.from('portfolio').select('*').in('id', ids)
      portfolio = (fetched as PortfolioItem[]) ?? []
    }
  }

  return {
    servicios,
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
      servicios={data.servicios}
      portfolio={data.portfolio}
      testimonios={data.testimonios}
      menuItems={data.menuItems}
      bloqueos={data.bloqueos}
    />
  )
}

