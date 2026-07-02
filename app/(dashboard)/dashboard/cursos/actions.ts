'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'

export async function createCursoAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  const nombre = formData.get('nombre') as string
  const descripcion = formData.get('descripcion') as string
  const precioRaw = formData.get('precio') as string
  const duracionRaw = formData.get('duracion') as string
  const imagen_url = (formData.get('imagen_url') as string) || null
  const tipo = (formData.get('tipo') as string) || 'servicio'
  const modo_venta = (formData.get('modo_venta') as string) || 'whatsapp'
  const link_externo = (formData.get('link_externo') as string) || null
  const mensaje_whatsapp = (formData.get('mensaje_whatsapp') as string) || null
  const mostrar_en_landing = formData.get('mostrar_en_landing') === 'true'

  if (!nombre) {
    return { error: 'El nombre del curso es obligatorio' }
  }

  const precio = parseFloat(parseFloat(precioRaw).toFixed(2))
  if (isNaN(precio) || precio < 0 || precio > 99999999) {
    return { error: 'El precio debe ser un número válido entre 0 y 99.999.999' }
  }

  let duracion_horas: number | null = null
  if (duracionRaw) {
    const parsedDuracion = parseFloat(duracionRaw)
    if (!isNaN(parsedDuracion)) {
      if (parsedDuracion < 0 || parsedDuracion > 99) {
        return { error: 'La duración debe ser un número válido entre 0 y 99 horas' }
      }
      duracion_horas = parseFloat(parsedDuracion.toFixed(2))
    }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('cursos').insert({
    user_id: user.id,
    nombre,
    descripcion: descripcion || null,
    precio,
    duracion_horas,
    activo: true,
    imagen_url,
    tipo,
    modo_venta,
    link_externo,
    mensaje_whatsapp,
    mostrar_en_landing,
  })

  if (error) {
    console.error('Error al crear curso:', error.message)
    return { error: 'No se pudo crear el curso: ' + error.message }
  }

  revalidatePath('/dashboard/cursos')
  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}

export async function updateCursoAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const nombre = formData.get('nombre') as string
  if (!nombre) return { error: 'El nombre es obligatorio' }

  const precioRaw = formData.get('precio') as string
  const duracionRaw = formData.get('duracion') as string

  const precio = parseFloat(parseFloat(precioRaw).toFixed(2))
  if (isNaN(precio) || precio < 0) return { error: 'Precio inválido' }

  let duracion_horas: number | null = null
  if (duracionRaw) {
    const p = parseFloat(duracionRaw)
    if (!isNaN(p) && p >= 0) duracion_horas = parseFloat(p.toFixed(2))
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('cursos')
    .update({
      nombre,
      descripcion: (formData.get('descripcion') as string) || null,
      precio,
      duracion_horas,
      imagen_url: (formData.get('imagen_url') as string) || null,
      tipo: (formData.get('tipo') as string) || 'servicio',
      modo_venta: (formData.get('modo_venta') as string) || 'whatsapp',
      link_externo: (formData.get('link_externo') as string) || null,
      mensaje_whatsapp: (formData.get('mensaje_whatsapp') as string) || null,
      mostrar_en_landing: formData.get('mostrar_en_landing') === 'true',
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al actualizar: ' + error.message }

  revalidatePath('/dashboard/cursos')
  revalidatePath('/')
  return { success: true }
}

export async function deleteCursoAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('cursos')
    .update({ activo: false })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar: ' + error.message }

  revalidatePath('/dashboard/cursos')
  revalidatePath('/dashboard')
  revalidatePath('/')
  return { success: true }
}
