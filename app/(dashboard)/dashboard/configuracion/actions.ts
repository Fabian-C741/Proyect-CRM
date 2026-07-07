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

  // Primero ver si ya existe un registro para este usuario
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  let error
  if (existing) {
    // Actualizar registro existente
    const { error: updateError } = await supabase
      .from('site_settings')
      .update(payload)
      .eq('id', existing.id)
    error = updateError
  } else {
    // Insertar nuevo
    const { error: insertError } = await supabase
      .from('site_settings')
      .insert(payload)
    error = insertError
  }

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
    precio: parseFloat((formData.get('precio') as string)) || 0,
    duracion_minutos: parseInt((formData.get('duracion_minutos') as string)) || null,
    orden: parseInt((formData.get('orden') as string) || '0') || 0,
    activo: formData.get('activo') === 'on',
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
      precio: parseFloat((formData.get('precio') as string)) || 0,
      duracion_minutos: parseInt((formData.get('duracion_minutos') as string)) || null,
      orden: parseInt((formData.get('orden') as string) || '0') || 0,
      activo: formData.get('activo') === 'on',
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

// ─────────────────────────────────────────────
// MENU ITEMS
// ─────────────────────────────────────────────
export async function createMenuItemAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const label = formData.get('label') as string
  if (!label) return { error: 'La etiqueta del menú es obligatoria' }

  const rawHref = formData.get('href') as string
  const parent_id = (formData.get('parent_id') as string) || null

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('menu_items').insert({
    user_id: user.id,
    label: label.trim(),
    href: rawHref?.trim() || null,
    parent_id: parent_id || null,
    orden: parseInt((formData.get('orden') as string) || '0') || 0,
    activo: true,
  })

  if (error) return { error: 'Error al crear elemento de menú: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function updateMenuItemAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const label = formData.get('label') as string
  if (!label) return { error: 'La etiqueta es obligatoria' }

  const rawHref = formData.get('href') as string
  const parent_id = (formData.get('parent_id') as string) || null

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('menu_items')
    .update({
      label: label.trim(),
      href: rawHref?.trim() || null,
      parent_id: parent_id || null,
      orden: parseInt((formData.get('orden') as string) || '0') || 0,
      activo: formData.get('activo') === 'true',
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al actualizar elemento de menú: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// BLOQUEOS HORARIOS
// ─────────────────────────────────────────────
export async function crearBloqueoAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const fecha = formData.get('fecha') as string
  if (!fecha) return { error: 'La fecha es obligatoria' }

  const hora_inicio = (formData.get('hora_inicio') as string) || null
  const hora_fin = (formData.get('hora_fin') as string) || null
  const motivo = (formData.get('motivo') as string) || null

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('bloqueos_horarios').insert({
    user_id: user.id,
    fecha,
    hora_inicio,
    hora_fin,
    motivo,
    activo: true,
  })

  if (error) return { error: 'Error al crear bloqueo: ' + error.message }
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function eliminarBloqueoAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('bloqueos_horarios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar bloqueo: ' + error.message }
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function deleteMenuItemAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar elemento de menú: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

