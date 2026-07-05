import 'server-only'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'
import type { ReservaWeb } from '@/lib/definitions'

/**
 * Obtiene las reservas web para el admin autenticado.
 */
export async function getReservasWeb(limit = 50): Promise<ReservaWeb[]> {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('reservas_web')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[getReservasWeb]', error.message)
      return []
    }

    return (data ?? []) as ReservaWeb[]
  } catch {
    return []
  }
}
