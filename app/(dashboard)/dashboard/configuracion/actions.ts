'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'

// ─────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────
export async function saveSiteSettingsAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const payload = {
    user_id: user.id,
    brand_name: (formData.get('brand_name') as string) || 'Mi Estudio',
    hero_title: (formData.get('hero_title') as string) || 'Realza tu belleza natural',
    hero_subtitle: (formData.get('hero_subtitle') as string) || null,
    hero_cta_text: (formData.get('hero_cta_text') as string) || 'Reserva tu turno',
    whatsapp_number: (formData.get('whatsapp_number') as string) || null,
    sobre_mi_texto: (formData.get('sobre_mi_texto') as string) || null,
    sobre_mi_imagen_url: (formData.get('sobre_mi_imagen_url') as string) || null,
    updated_at: new Date().toISOString(),
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('site_settings')
    .upsert(payload, { onConflict: 'user_id' })

  if (error) return { error: 'Error al guardar: ' + error.message }

  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// SERVICIOS
// ─────────────────────────────────────────────
export async function createServicioAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const nombre = formData.get('nombre') as string
  if (!nombre) return { error: 'El nombre es obligatorio' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('servicios').insert({
    user_id: user.id,
    nombre,
    descripcion: (formData.get('descripcion') as string) || null,
    imagen_url: (formData.get('imagen_url') as string) || null,
    orden: parseInt((formData.get('orden') as string) || '0') || 0,
    activo: true,
  })

  if (error) return { error: 'Error al crear: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function updateServicioAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('servicios')
    .update({
      nombre: formData.get('nombre') as string,
      descripcion: (formData.get('descripcion') as string) || null,
      imagen_url: (formData.get('imagen_url') as string) || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al actualizar: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function deleteServicioAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('servicios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// PORTFOLIO
// ─────────────────────────────────────────────
export async function addPortfolioItemAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const imagen_url = formData.get('imagen_url') as string
  if (!imagen_url) return { error: 'La URL de la imagen es obligatoria' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('portfolio').insert({
    user_id: user.id,
    imagen_url,
    descripcion: (formData.get('descripcion') as string) || null,
    orden: 0,
  })

  if (error) return { error: 'Error al agregar: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function deletePortfolioItemAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('portfolio')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// TESTIMONIOS
// ─────────────────────────────────────────────
export async function createTestimonioAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const nombre_cliente = formData.get('nombre_cliente') as string
  const texto = formData.get('texto') as string
  if (!nombre_cliente || !texto) return { error: 'Nombre y texto son obligatorios' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('testimonios').insert({
    user_id: user.id,
    nombre_cliente,
    texto,
    estrellas: parseInt((formData.get('estrellas') as string) || '5') || 5,
    activo: true,
  })

  if (error) return { error: 'Error al crear: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function deleteTestimonioAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('testimonios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}
