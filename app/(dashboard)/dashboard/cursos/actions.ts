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

  // Formatear precio a 2 decimales máximo
  const precio = parseFloat(parseFloat(precioRaw).toFixed(2))
  if (isNaN(precio) || precio < 0 || precio > 99999999) {
    return { error: 'El precio debe ser un número válido entre 0 y 99.999.999' }
  }

  // Formatear duración a 2 decimales máximo
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
