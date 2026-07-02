import 'server-only'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Servicio, PortfolioItem, Testimonio, SiteSettings, Curso } from '@/lib/definitions'

/**
 * Obtiene la configuración del sitio (primera fila activa — single-user design).
 * No requiere autenticación, lectura pública.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) return null
    return data
  } catch {
    return null
  }
}

/**
 * Obtiene los servicios activos para la landing (público).
 */
export async function getServiciosPublicos(): Promise<Servicio[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true })

    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

/**
 * Obtiene las imágenes del portfolio para la landing (público).
 */
export async function getPortfolioPublico(): Promise<PortfolioItem[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('orden', { ascending: true })

    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

/**
 * Obtiene los testimonios activos para la landing (público).
 */
export async function getTestimoniosPublicos(): Promise<Testimonio[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('testimonios')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })

    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

/**
 * Obtiene los cursos/productos activos para la landing (público).
 */
export async function getCursosPublicos(): Promise<Curso[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('activo', true)
      .eq('mostrar_en_landing', true)
      .order('created_at', { ascending: false })

    if (error) return []
    return (data ?? []) as Curso[]
  } catch {
    return []
  }
}
