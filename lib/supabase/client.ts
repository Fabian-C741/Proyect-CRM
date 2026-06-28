'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente Supabase para usar en Client Components.
 * Solo usa la ANON_KEY (pública) — nunca la SERVICE_ROLE_KEY.
 * RLS en Supabase protege los datos a nivel de base de datos.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
