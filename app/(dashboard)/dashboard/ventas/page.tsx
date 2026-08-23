import { requireAuth } from '@/lib/dal/auth'
import { listarPedidos } from '@/lib/dal/pedidos'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import VentasClient from './VentasClient'

export const dynamic = 'force-dynamic'

export default async function VentasPage() {
  const user = await requireAuth()
  const pedidos = await listarPedidos(user.id)

  const ids = Array.from(new Set(pedidos.map(p => p.producto_id).filter(Boolean))) as string[]
  let nombres: Record<string, string> = {}
  if (ids.length) {
    const admin = getSupabaseAdmin()
    const { data } = await (admin.from('cursos') as any).select('id, nombre').in('id', ids)
    for (const c of (data || []) as { id: string; nombre: string }[]) nombres[c.id] = c.nombre
  }

  return <VentasClient pedidos={pedidos} nombres={nombres} />
}
