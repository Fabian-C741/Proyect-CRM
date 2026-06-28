import 'server-only'
import { cache } from 'react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'
import type { Cliente } from '@/lib/definitions'

/**
 * Obtiene todos los clientes del usuario autenticado.
 * RLS en Supabase filtra automáticamente por user_id — nunca ve datos de otros.
 */
export const getClientes = cache(async (): Promise<Cliente[]> => {
  const user = await getCurrentUser()
  if (!user) return []

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('clientes')
    .select('id, user_id, nombre, email, telefono, notas, created_at, updated_at')
    .order('nombre', { ascending: true })

  if (error) {
    console.error('[DAL:clientes] Error al obtener clientes:', error.message)
    return []
  }

  return data ?? []
})

/**
 * Obtiene un cliente específico por ID.
 * Verifica que el cliente pertenezca al usuario actual (doble seguridad además de RLS).
 */
export const getCliente = cache(async (id: string): Promise<Cliente | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('clientes')
    .select('id, user_id, nombre, email, telefono, notas, created_at, updated_at')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  // Doble verificación: aunque RLS ya filtra, verificamos en código también
  if (data.user_id !== user.id) {
    return null
  }

  return data
})

/**
 * Retorna el conteo total de clientes para el dashboard.
 */
export const getClientesCount = cache(async (): Promise<number> => {
  const user = await getCurrentUser()
  if (!user) return 0

  const supabase = await createSupabaseServerClient()
  const { count, error } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true })

  if (error) return 0
  return count ?? 0
})
