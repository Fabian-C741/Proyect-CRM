import 'server-only'
import { cache } from 'react'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'
import type { Curso, Agenda } from '@/lib/definitions'

/**
 * Obtiene todos los cursos/servicios del usuario autenticado.
 */
export const getCursos = cache(async (): Promise<Curso[]> => {
  const user = await getCurrentUser()
  if (!user) return []

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('cursos')
    .select('id, user_id, nombre, descripcion, precio, duracion_horas, activo, imagen_url, tipo, modo_venta, link_externo, mensaje_whatsapp, mostrar_en_landing, orden, created_at')
    .eq('activo', true)
    .order('orden', { ascending: true, nullsFirst: false })
    .order('nombre', { ascending: true })

  if (error) {
    console.error('[DAL:cursos] Error al obtener cursos:', error.message)
    return []
  }

  return (data ?? []) as Curso[]
})


/**
 * Obtiene un curso específico por ID.
 */
export const getCurso = cache(async (id: string): Promise<Curso | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('cursos')
    .select('id, user_id, nombre, descripcion, precio, duracion_horas, activo, imagen_url, tipo, modo_venta, link_externo, mensaje_whatsapp, mostrar_en_landing, orden, created_at')
    .eq('id', id)
    .single()

  if (error || !data) return null

  // Verificación de ownership además de RLS
  if (data.user_id !== user.id) return null

  return data as Curso
})

/**
 * Obtiene las citas de la agenda del usuario, con join de cliente y curso.
 */
export const getAgenda = cache(async (limite: number = 10): Promise<Agenda[]> => {
  const user = await getCurrentUser()
  if (!user) return []

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('agenda')
    .select(`
      id, user_id, cliente_id, curso_id, fecha, estado, notas, created_at,
      clientes (id, nombre, telefono),
      cursos (id, nombre, precio)
    `)
    .gte('fecha', new Date().toISOString())
    .order('fecha', { ascending: true })
    .limit(limite)

  if (error) {
    console.error('[DAL:agenda] Error al obtener agenda:', error.message)
    return []
  }

  return (data ?? []) as unknown as Agenda[]
})

/**
 * Conteo de cursos activos para el dashboard.
 */
export const getCursosCount = cache(async (): Promise<number> => {
  const user = await getCurrentUser()
  if (!user) return 0

  const supabase = await createSupabaseServerClient()
  const { count, error } = await supabase
    .from('cursos')
    .select('*', { count: 'exact', head: true })
    .eq('activo', true)

  if (error) return 0
  return count ?? 0
})

/**
 * Conteo de citas pendientes para el dashboard.
 */
export const getCitasPendientesCount = cache(async (): Promise<number> => {
  const user = await getCurrentUser()
  if (!user) return 0

  const supabase = await createSupabaseServerClient()
  const { count, error } = await supabase
    .from('agenda')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'pendiente')
    .gte('fecha', new Date().toISOString())

  if (error) return 0
  return count ?? 0
})
