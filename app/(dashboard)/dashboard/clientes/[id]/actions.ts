'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'

export async function updateClienteAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const nombre = formData.get('nombre') as string
  if (!nombre?.trim()) return { error: 'El nombre es obligatorio' }

  const email = formData.get('email') as string
  const telefono = formData.get('telefono') as string
  const notas = formData.get('notas') as string

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('clientes')
    .update({
      nombre: nombre.trim(),
      email: email?.trim() || null,
      telefono: telefono?.trim() || null,
      notas: notas?.trim() || null,
    })
    .eq('id', id)
    .eq('user_id', user.id) // doble seguridad además de RLS

  if (error) {
    console.error('[actions:updateCliente]', error.message)
    return { error: 'No se pudo actualizar el cliente: ' + error.message }
  }

  revalidatePath(`/dashboard/clientes/${id}`)
  revalidatePath('/dashboard/clientes')
  return { success: true }
}

export async function deleteClienteAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // doble seguridad además de RLS

  if (error) {
    console.error('[actions:deleteCliente]', error.message)
    return { error: 'No se pudo eliminar el cliente: ' + error.message }
  }

  revalidatePath('/dashboard/clientes')
  revalidatePath('/dashboard')
  redirect('/dashboard/clientes')
}
