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

  if (!nombre) {
    return { error: 'El nombre del curso es obligatorio' }
  }

  const precio = parseFloat(precioRaw)
  if (isNaN(precio) || precio < 0) {
    return { error: 'El precio debe ser un número válido igual o mayor a 0' }
  }

  const duracion_horas = duracionRaw ? parseFloat(duracionRaw) : null

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('cursos').insert({
    user_id: user.id,
    nombre,
    descripcion: descripcion || null,
    precio,
    duracion_horas: isNaN(duracion_horas as number) ? null : duracion_horas,
    activo: true
  })

  if (error) {
    console.error('Error al crear curso:', error.message)
    return { error: 'No se pudo crear el curso: ' + error.message }
  }

  revalidatePath('/dashboard/cursos')
  revalidatePath('/dashboard') // Revalidar el dashboard para el contador
  return { success: true }
}
