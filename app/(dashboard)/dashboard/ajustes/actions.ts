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
  const whatsappNumber = formData.get('whatsappNumber') as string

  // Asumimos que siempre hay una fila (el ID no importa si actualizamos todo)
  const { error } = await supabase
    .from('site_settings')
    .update({
      brand_name: brandName,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      hero_cta_text: heroCtaText,
      whatsapp_number: whatsappNumber,
      updated_at: new Date().toISOString()
    })
    .neq('id', '00000000-0000-0000-0000-000000000000') // Actualiza cualquier fila

  if (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Hubo un error al guardar los ajustes' }
  }

  // Refrescar caché para que los cambios se vean en la web pública de inmediato
  revalidatePath('/')
  revalidatePath('/(auth)/login', 'layout') // también el login
  
  return { success: true }
}
