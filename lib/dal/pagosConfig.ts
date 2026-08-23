import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function obtenerTokenMP(): Promise<string> {
  try {
    const admin = getSupabaseAdmin()
    const { data } = await ((admin.from('pagos_config') as any)
      .select('mp_access_token')
      .eq('id', 1)
      .maybeSingle())
    const dbToken = (data as { mp_access_token?: string | null } | null)?.mp_access_token
    if (dbToken && dbToken.trim()) return dbToken.trim()
  } catch (e) {
    console.error('[pagosConfig] no se pudo leer pagos_config:', e)
  }
  return process.env.MERCADOPAGO_ACCESS_TOKEN || ''
}

export async function tokenMPConfigurado(): Promise<boolean> {
  return (await obtenerTokenMP()).length > 0
}
