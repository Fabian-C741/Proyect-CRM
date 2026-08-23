import 'server-only'
import { randomUUID } from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { Pedido } from '@/lib/definitions'

export async function crearPedido(input: {
  user_id: string
  producto_id: string | null
  tipo?: string | null
  nombre_cliente?: string | null
  email?: string | null
  telefono?: string | null
  monto: number
  estado?: Pedido['estado']
  mp_preference_id?: string | null
}): Promise<Pedido> {
  const admin = getSupabaseAdmin()
  const { data, error } = await (admin.from('pedidos') as any)
    .insert({
      user_id: input.user_id,
      producto_id: input.producto_id,
      tipo: input.tipo ?? null,
      nombre_cliente: input.nombre_cliente ?? null,
      email: input.email ?? null,
      telefono: input.telefono ?? null,
      monto: input.monto,
      estado: input.estado ?? 'pendiente',
      mp_preference_id: input.mp_preference_id ?? null,
      download_token: randomUUID(),
      download_expires_at: null,
    })
    .select('*')
    .single()

  if (error || !data) {
    console.error('[pedidos] crearPedido error:', error)
    throw new Error('No se pudo crear el pedido')
  }
  return data as Pedido
}

export async function obtenerPorPreference(preferenceId: string): Promise<Pedido | null> {
  const admin = getSupabaseAdmin()
  const { data } = await (admin.from('pedidos') as any)
    .select('*')
    .eq('mp_preference_id', preferenceId)
    .maybeSingle()
  return (data as Pedido) || null
}

export async function obtenerPorToken(token: string): Promise<Pedido | null> {
  const admin = getSupabaseAdmin()
  const { data } = await (admin.from('pedidos') as any)
    .select('*')
    .eq('download_token', token)
    .maybeSingle()
  return (data as Pedido) || null
}

export async function obtenerPedido(id: string): Promise<Pedido | null> {
  const admin = getSupabaseAdmin()
  const { data } = await (admin.from('pedidos') as any)
    .select('*')
    .eq('id', id)
    .maybeSingle()
  return (data as Pedido) || null
}

export async function marcarPagado(id: string, mpPaymentId: string): Promise<Pedido | null> {
  const admin = getSupabaseAdmin()
  const { data, error } = await (admin.from('pedidos') as any)
    .update({ estado: 'pagado', mp_payment_id: mpPaymentId, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error) {
    console.error('[pedidos] marcarPagado error:', error)
    return null
  }
  return data as Pedido
}

export async function aprobarManual(id: string): Promise<Pedido | null> {
  const admin = getSupabaseAdmin()
  const { data, error } = await (admin.from('pedidos') as any)
    .update({ estado: 'pagado', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()
  if (error) {
    console.error('[pedidos] aprobarManual error:', error)
    return null
  }
  return data as Pedido
}

export async function setComprobante(id: string, comprobanteUrl: string): Promise<void> {
  const admin = getSupabaseAdmin()
  await (admin.from('pedidos') as any)
    .update({ comprobante_url: comprobanteUrl, updated_at: new Date().toISOString() })
    .eq('id', id)
}

export async function contarPendientes(userId: string): Promise<number> {
  const admin = getSupabaseAdmin()
  const { count, error } = await (admin.from('pedidos') as any)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('estado', 'pendiente_manual')
  if (error) return 0
  return count || 0
}

export async function listarPedidos(userId: string, limite = 100): Promise<Pedido[]> {
  const admin = getSupabaseAdmin()
  const { data, error } = await (admin.from('pedidos') as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limite)
  if (error) return []
  return (data as Pedido[]) || []
}
