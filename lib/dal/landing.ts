import 'server-only'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Servicio, PortfolioItem, Testimonio, SiteSettings, Curso, MenuItem } from '@/lib/definitions'

export interface ReservaWebInput {
  nombre_visitante: string
  telefono_visitante: string
  servicio_id: string | null
  servicio_nombre: string
  servicio_precio: number | null
  fecha_preferida: string   // YYYY-MM-DD
  hora_preferida: string | null
  notas: string | null
}

/**
 * Crea una reserva web de un visitante anónimo.
 * Usa supabaseAdmin para bypassear la autenticación ya que el visitante no tiene sesión.
 * Asocia la reserva al primer admin registrado en site_settings.
 */
export async function crearReservaWeb(data: ReservaWebInput): Promise<{ success: boolean; error?: string }> {
  try {
    // Obtener el user_id del admin desde site_settings
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('site_settings')
      .select('user_id')
      .limit(1)
      .maybeSingle()

    if (settingsError || !settings?.user_id) {
      return { success: false, error: 'No se encontró la configuración del negocio.' }
    }

    const { error } = await supabaseAdmin.from('reservas_web').insert({
      user_id: settings.user_id,
      ...data,
      estado: 'pendiente',
    })

    if (error) {
      console.error('[crearReservaWeb]', error.message)
      return { success: false, error: 'No se pudo guardar la reserva.' }
    }

    return { success: true }
  } catch (e) {
    console.error('[crearReservaWeb] excepción:', e)
    return { success: false, error: 'Error inesperado.' }
  }
}


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

/**
 * Obtiene los elementos de menú activos y los estructura con sus hijos (dropdowns).
 */
export async function getMenuItemsPublicos(): Promise<MenuItem[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true })

    if (error || !data) return []

    const items = data as MenuItem[]
    const roots = items.filter((item) => !item.parent_id)
    
    roots.forEach((root) => {
      root.children = items.filter((item) => item.parent_id === root.id)
    })

    return roots
  } catch {
    return []
  }
}

