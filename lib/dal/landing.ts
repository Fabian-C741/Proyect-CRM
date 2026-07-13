import 'server-only'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { PortfolioItem, Testimonio, SiteSettings, Curso, MenuItem } from '@/lib/definitions'

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
 * Verifica si el día/hora está disponible para reservar.
 * Retorna un mensaje de error si no está disponible, o null si está libre.
 */
async function verificarDisponibilidad(userId: string, fecha: string, hora: string | null): Promise<string | null> {
  const adminClient = getSupabaseAdmin()

  // 1. Verificar bloqueos del admin (día completo o franja horaria)
  const { data: bloqueosRaw, error: blkErr } = await (adminClient
    .from('bloqueos_horarios') as any)
    .select('hora_inicio, hora_fin, motivo')
    .eq('user_id', userId)
    .eq('activo', true)
    .eq('fecha', fecha)

  const bloqueos = bloqueosRaw as Array<{ hora_inicio: string | null; hora_fin: string | null; motivo: string | null }> | null

  if (!blkErr && bloqueos && bloqueos.length > 0) {
    for (const b of bloqueos) {
      const bloqueaDiaCompleto = !b.hora_inicio && !b.hora_fin
      if (bloqueaDiaCompleto) {
        return b.motivo || 'Lo sentimos, este día no está disponible para reservas.'
      }
      if (hora && b.hora_inicio && b.hora_fin) {
        const hh = hora.slice(0, 5)
        const hi = b.hora_inicio.slice(0, 5)
        const hf = b.hora_fin.slice(0, 5)
        if (hh >= hi && hh < hf) {
          return 'Lo sentimos, esta franja horaria no está disponible.'
        }
      }
    }
  }

  // 2. Verificar que no haya otra reserva NO cancelada en el mismo día+horario
  if (hora) {
    const { data: existingRaw } = await (adminClient
      .from('reservas_web') as any)
      .select('id')
      .eq('user_id', userId)
      .eq('fecha_preferida', fecha)
      .eq('hora_preferida', hora)
      .neq('estado', 'cancelado')
      .limit(1)

    const existing = existingRaw as Array<{ id: string }> | null
    if (existing && existing.length > 0) {
      return 'Este horario ya está reservado. Por favor, elegí otro horario.'
    }
  }

  return null
}

/**
 * Crea una reserva web de un visitante anónimo.
 * Valida disponibilidad antes de guardar.
 * Usa getSupabaseAdmin() para bypassear la autenticación ya que el visitante no tiene sesión.
 * Asocia la reserva al primer admin registrado en site_settings.
 */
export async function crearReservaWeb(data: ReservaWebInput): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getSupabaseAdmin()
    const { data: settingsRow } = await (admin.from('site_settings') as any)
      .select('user_id')
      .not('user_id', 'is', null)
      .limit(1)
      .maybeSingle()

    const adminId: string | null = settingsRow?.user_id || null
    if (!adminId) {
      return { success: false, error: 'No hay configuración del negocio. Entrá al Dashboard > Ajustes y guardá los datos.' }
    }

    // Validar disponibilidad antes de insertar
    const disponibleError = await verificarDisponibilidad(adminId, data.fecha_preferida, data.hora_preferida)
    if (disponibleError) {
      return { success: false, error: disponibleError }
    }

    const adminClient = getSupabaseAdmin()
    const { error } = await (adminClient.from('reservas_web') as any).insert({
      user_id: adminId,
      nombre_visitante: data.nombre_visitante,
      telefono_visitante: data.telefono_visitante,
      servicio_id: data.servicio_id,
      servicio_nombre: data.servicio_nombre,
      servicio_precio: data.servicio_precio,
      fecha_preferida: data.fecha_preferida,
      hora_preferida: data.hora_preferida,
      notas: data.notas,
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

    if (error) {
      console.error('[DAL:landing] getSiteSettings error:', error.message, error.code)
      return null
    }
    return data
  } catch (e) {
    console.error('[DAL:landing] getSiteSettings excepción:', e)
    return null
  }
}

// ─────────────────────────────────────────────
// FUNCIONES PÚBLICAS (landing page) ───────────
// ─────────────────────────────────────────────

/**
 * Obtiene todos los productos/servicios activos para la landing (público).
 * Tabla unificada: incluye servicios, cursos, PDFs y eBooks.
 */
export async function getProductosPublicos(): Promise<Curso[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[DAL:landing] getProductosPublicos error:', error.message, error.code, error.details, error.hint)
      return []
    }
    if (!data) return []
    return (data as Curso[]).filter(c => c.mostrar_en_landing !== false)
  } catch (e) {
    console.error('[DAL:landing] getProductosPublicos excepción:', e)
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

    if (error) {
      console.error('[DAL:landing] getPortfolioPublico error:', error.message, error.code)
      return []
    }
    return data ?? []
  } catch (e) {
    console.error('[DAL:landing] getPortfolioPublico excepción:', e)
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

    if (error) {
      console.error('[DAL:landing] getTestimoniosPublicos error:', error.message, error.code)
      return []
    }
    return data ?? []
  } catch (e) {
    console.error('[DAL:landing] getTestimoniosPublicos excepción:', e)
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

    if (error) {
      console.error('[DAL:landing] getMenuItemsPublicos error:', error.message, error.code)
      return []
    }
    if (!data) return []

    const items = data as MenuItem[]
    const roots = items.filter((item) => !item.parent_id)
    
    roots.forEach((root) => {
      root.children = items.filter((item) => item.parent_id === root.id)
    })

    return roots
  } catch (e) {
    console.error('[DAL:landing] getMenuItemsPublicos excepción:', e)
    return []
  }
}

