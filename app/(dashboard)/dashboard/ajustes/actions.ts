'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'No autorizado' }
  }

  const brandName = formData.get('brandName') as string
  const heroTitle = formData.get('heroTitle') as string
  const heroSubtitle = formData.get('heroSubtitle') as string
  const heroCtaText = formData.get('heroCtaText') as string
  const whatsappNumber = (formData.get('whatsappNumber') as string) || null
  const sobreMiTexto = (formData.get('sobreMiTexto') as string) || null
  const sobreMiImagenUrl = (formData.get('sobreMiImagenUrl') as string) || null
  const faviconUrl = (formData.get('faviconUrl') as string) || null
  const ctaTitle = (formData.get('ctaTitle') as string) || null
  const ctaText = (formData.get('ctaText') as string) || null
  const ctaButtonText = (formData.get('ctaButtonText') as string) || null
  const pwaIconUrl = (formData.get('pwaIconUrl') as string) || null

  const admin = getSupabaseAdmin()
  const tbl = admin.from('site_settings') as any

  const { data: existing, error: selError } = await tbl
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (selError) {
    console.error('Error checking settings:', selError)
    return { success: false, error: 'Error al verificar: ' + selError.message }
  }

  const payload: Record<string, any> = {
    brand_name: brandName,
    hero_title: heroTitle,
    hero_subtitle: heroSubtitle,
    hero_cta_text: heroCtaText,
    whatsapp_number: whatsappNumber,
    sobre_mi_texto: sobreMiTexto,
    sobre_mi_imagen_url: sobreMiImagenUrl,
    favicon_url: faviconUrl,
    cta_title: ctaTitle,
    cta_text: ctaText,
    cta_button_text: ctaButtonText,
    pwa_icon_url: pwaIconUrl,
    updated_at: new Date().toISOString(),
  }

  let error
  if (existing) {
    const { error: updateError } = await tbl.update({ user_id: user.id, ...payload }).eq('id', existing.id)
    error = updateError
  } else {
    const { error: insertError } = await tbl.insert({ user_id: user.id, ...payload })
    error = insertError
  }

  if (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Error: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath('/dashboard/ajustes')
  revalidatePath('/(auth)/login', 'layout')
  
  return { success: true }
}

export async function crearReservaWebAction(data: any) {
  const { crearReservaWeb } = await import('@/lib/dal/landing')
  return await crearReservaWeb(data)
}

export async function checkFechaBloqueadaAction(fecha: string): Promise<{ bloqueada: boolean; mensaje?: string }> {
  const admin = getSupabaseAdmin()
  // Buscar cualquier bloqueo activo para esa fecha (sin importar user_id)
  try {
    const { data: bloqueos, error } = await (admin.from('bloqueos_horarios') as any)
      .select('motivo')
      .eq('fecha', fecha)
      .eq('activo', true)
      .limit(1)
    if (error) console.error('[checkFechaBloqueada] error:', error)
    if (bloqueos && bloqueos.length > 0) {
      const motivo = bloqueos[0]?.motivo
      return { bloqueada: true, mensaje: motivo || 'Este día no está disponible para reservas.' }
    }
  } catch (e) {
    console.error('[checkFechaBloqueada] exception:', e)
  }
  return { bloqueada: false }
}
