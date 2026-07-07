'use server'

import { createSupabaseServerClient } from './server'

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const supabase = await createSupabaseServerClient()
  const file = formData.get('file') as File
  if (!file) return { error: 'No se seleccionó ningún archivo' }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { data, error } = await supabase.storage
    .from('servicios')
    .upload(fileName, file, { contentType: file.type, upsert: false })

  if (error) {
    if (error.message.includes('bucket')) {
      return { error: 'El bucket "servicios" no existe. Crealo en Supabase > Storage.' }
    }
    return { error: 'Error al subir: ' + error.message }
  }

  const { data: { publicUrl } } = supabase.storage.from('servicios').getPublicUrl(data.path)
  return { url: publicUrl }
}
