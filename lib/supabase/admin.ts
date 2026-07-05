import { createClient } from '@supabase/supabase-js'
import 'server-only'

/**
 * Cliente Supabase con SERVICE_ROLE_KEY.
 * ⚠️ PELIGRO: bypasea RLS — usa SOLO para operaciones administrativas en el DAL.
 * NUNCA en Client Components ni pasar datos de este cliente al cliente.
 * 'server-only' garantiza error de compilación si se importa en el browser.
 */
let adminClient: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (adminClient) return adminClient

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env variables for admin operations')
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}
