'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const brandName = formData.get('brandName') as string
  const heroTitle = formData.get('heroTitle') as string
  const heroSubtitle = formData.get('heroSubtitle') as string
  const heroCtaText = formData.get('heroCtaText') as string

  // Verificar si ya existe un registro para este usuario
  const { data: existing, error: selError } = await supabase
    .from('site_settings')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (selError) {
    console.error('Error checking settings:', selError)
    return { success: false, error: 'Error al verificar: ' + selError.message }
  }

  let error
  if (existing) {
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({
        brand_name: brandName,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_cta_text: heroCtaText,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('site_settings')
      .insert({
        user_id: user.id,
        brand_name: brandName,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_cta_text: heroCtaText,
      })
    error = insertError
  }

  if (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Error: ' + error.message }
  }

  // Refrescar caché para que los cambios se vean en la web pública de inmediato
  revalidatePath('/')
  revalidatePath('/(auth)/login', 'layout') // también el login
  
  return { success: true }
}

export async function crearReservaWebAction(data: any) {
  // Import dinámico en el scope de la función para evitar conflictos de importaciones server/client
  const { crearReservaWeb } = await import('@/lib/dal/landing')
  return await crearReservaWeb(data)
}
