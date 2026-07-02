'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'

export async function createClienteAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'No autorizado' }
  }

  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const telefono = formData.get('telefono') as string
  const notas = formData.get('notas') as string

  if (!nombre) {
    return { error: 'El nombre es obligatorio' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('clientes').insert({
    user_id: user.id,
    nombre,
    email: email || null,
    telefono: telefono || null,
    notas: notas || null,
  })

  if (error) {
    console.error('Error al crear cliente:', error.message)
    return { error: 'No se pudo crear el cliente: ' + error.message }
  }

  revalidatePath('/dashboard/clientes')
  revalidatePath('/dashboard') // Revalidar el contador del dashboard principal
  return { success: true }
}
