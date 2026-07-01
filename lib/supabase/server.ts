import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import 'server-only'

/**
 * Cliente Supabase para usar en Server Components, Server Actions y Route Handlers.
 * Lee las cookies del request actual para obtener la sesión del usuario.
 * SOLO SERVIDOR — importar 'server-only' previene uso accidental en el cliente.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll puede fallar en Server Components de solo lectura.
            // El middleware/proxy se encarga de refrescar la sesión.
          }
        },
      },
    }
  )
}
