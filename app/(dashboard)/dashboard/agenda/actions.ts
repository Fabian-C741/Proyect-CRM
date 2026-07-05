'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'

export async function createCitaAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  const cliente_id = formData.get('cliente_id') as string
  const curso_id = formData.get('curso_id') as string
  const fechaRaw = formData.get('fecha') as string
  const horaRaw = formData.get('hora') as string
  const notas = formData.get('notas') as string

  if (!cliente_id) {
    return { error: 'El cliente es obligatorio' }
  }
  if (!fechaRaw || !horaRaw) {
    return { error: 'La fecha y la hora son obligatorias' }
  }

  // Combinar fecha y hora en formato ISO string
  const fecha = new Date(`${fechaRaw}T${horaRaw}:00`).toISOString()

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('agenda').insert({
    user_id: user.id,
    cliente_id,
    curso_id: curso_id || null,
    fecha,
    estado: 'pendiente',
    notas: notas || null,
  })

  if (error) {
    console.error('Error al agendar cita:', error.message)
    return { error: 'No se pudo crear la cita: ' + error.message }
  }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard') // Revalidar contadores en dashboard
  return { success: true }
}

const ESTADOS_VALIDOS = ['pendiente', 'confirmado', 'cancelado', 'completado'] as const
type EstadoCita = (typeof ESTADOS_VALIDOS)[number]

export async function updateEstadoCitaAction(id: string, estado: EstadoCita) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return { error: 'Estado inválido' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('agenda')
    .update({ estado })
    .eq('id', id)
    .eq('user_id', user.id) // doble seguridad además de RLS

  if (error) {
    console.error('[actions:updateEstadoCita]', error.message)
    return { error: 'No se pudo actualizar el estado: ' + error.message }
  }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard')
  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// Reservas Web (visitantes sin login)
// ─────────────────────────────────────────────────────────────

const ESTADOS_RESERVA_WEB = ['pendiente', 'confirmado', 'cancelado'] as const
type EstadoReservaWeb = (typeof ESTADOS_RESERVA_WEB)[number]

export async function updateEstadoReservaWebAction(id: string, estado: EstadoReservaWeb) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  if (!ESTADOS_RESERVA_WEB.includes(estado)) {
    return { error: 'Estado inválido' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('reservas_web')
    .update({ estado })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('[actions:updateEstadoReservaWeb]', error.message)
    return { error: 'No se pudo actualizar el estado: ' + error.message }
  }

  revalidatePath('/dashboard/agenda')
  return { success: true }
}
