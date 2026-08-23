import 'server-only'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Pagina } from '@/lib/definitions'

/**
 * Obtiene todas las páginas activas (público, para menú/listados).
 */
export async function getPaginasPublicas(): Promise<Pagina[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('paginas')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[DAL:paginas] getPaginasPublicas error:', error.message, error.code)
      return []
    }
    return data ?? []
  } catch (e) {
    console.error('[DAL:paginas] getPaginasPublicas excepción:', e)
    return []
  }
}

/**
 * Obtiene todas las páginas del usuario (dashboard).
 */
export async function getPaginas(userId: string): Promise<Pagina[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('paginas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[DAL:paginas] getPaginas error:', error.message, error.code)
      return []
    }
    return data ?? []
  } catch (e) {
    console.error('[DAL:paginas] getPaginas excepción:', e)
    return []
  }
}

/**
 * Obtiene una página por slug (pública, solo activas).
 */
export async function getPaginaBySlug(slug: string): Promise<Pagina | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('paginas')
      .select('*')
      .eq('slug', slug)
      .eq('activo', true)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('[DAL:paginas] getPaginaBySlug error:', error.message, error.code)
      return null
    }
    return data
  } catch (e) {
    console.error('[DAL:paginas] getPaginaBySlug excepción:', e)
    return null
  }
}
