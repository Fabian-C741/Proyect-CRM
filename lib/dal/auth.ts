import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Obtiene el usuario actual de la sesión.
 * Usa cache() de React → se ejecuta UNA SOLA VEZ por request, aunque se llame en múltiples componentes.
 * Retorna null si no hay sesión (no redirige).
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Solo devolvemos los campos mínimos necesarios — nunca datos sensibles
  return {
    id: user.id,
    email: user.email ?? '',
    nombre: user.user_metadata?.nombre ?? user.email?.split('@')[0] ?? 'Usuario',
  }
})

/**
 * Versión estricta: si no hay usuario autenticado, redirige a /login.
 * Usar en layouts y páginas del dashboard para protegerlas.
 */
export const requireAuth = cache(async () => {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
})
