import { createClient } from '@supabase/supabase-js'
import 'server-only'

/**
 * Cliente Supabase con SERVICE_ROLE_KEY.
 * ⚠️ PELIGRO: bypasea RLS — usa SOLO para operaciones administrativas en el DAL.
 * NUNCA en Client Components ni pasar datos de este cliente al cliente.
 * 'server-only' garantiza error de compilación si se importa en el browser.
 */
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
