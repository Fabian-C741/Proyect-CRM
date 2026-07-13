import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { enviarEmail } from '@/lib/email'

export async function comprarPdfAction(formData: FormData) {
  const cursoId = formData.get('curso_id') as string
  const nombre = formData.get('nombre') as string
  const email = formData.get('email') as string
  const telefono = formData.get('telefono') as string

  if (!cursoId || !nombre || !telefono) {
    return { error: 'Faltan datos obligatorios' }
  }

  const admin = getSupabaseAdmin()

  // Obtener datos del curso
  const { data: curso, error: cursoErr } = await (admin
    .from('cursos') as any)
    .select('id, nombre, archivo_url, user_id')
    .eq('id', cursoId)
    .single()

  if (cursoErr || !curso?.archivo_url) {
    return { error: 'Producto no encontrado o sin archivo' }
  }

  const cursoData = curso as { id: string; nombre: string; archivo_url: string; user_id: string }

  // Generar link firmado (24h)
  const bucket = 'pdfs'
  const filePath = cursoData.archivo_url.split('/').pop()
  if (!filePath) return { error: 'URL de archivo inválida' }

  const { data: signedData, error: signedErr } = await admin.storage
    .from(bucket)
    .createSignedUrl(filePath, 60 * 60 * 24) // 24 horas

  if (signedErr || !signedData) {
    console.error('[Compra] Error al crear signed URL:', signedErr)
    return { error: 'Error al generar link de descarga' }
  }

  const downloadUrl = signedData.signedUrl

  // Obtener settings para WhatsApp del admin
  const { data: settings } = await (admin
    .from('site_settings') as any)
    .select('whatsapp_number, brand_name')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const settingsData = settings as { whatsapp_number?: string; brand_name?: string } | null
  const adminWpp = settingsData?.whatsapp_number || ''
  const brandName = settingsData?.brand_name || 'Mi tienda'

  // Enviar email al comprador
  if (email) {
    await enviarEmail({
      to: email,
      subject: `Tu compra en ${brandName} - ${cursoData.nombre}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto">
          <h2>¡Gracias por tu compra, ${nombre}!</h2>
          <p>Tu archivo <strong>${cursoData.nombre}</strong> está listo para descargar.</p>
          <p style="margin:24px 0">
            <a href="${downloadUrl}" style="background:#ec4899;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">
              DESCARGAR AHORA
            </a>
          </p>
          <p style="color:#666;font-size:13px">Este link expira en 24 horas.</p>
        </div>
      `,
    })
  }

  // Redirigir al comprador a WhatsApp con el link de descarga
  const mensajeComprador = encodeURIComponent(
    `Hola! Acabo de comprar "${cursoData.nombre}". Mi link de descarga: ${downloadUrl}`
  )
  const waUrl = adminWpp
    ? `https://wa.me/${adminWpp}?text=${mensajeComprador}`
    : downloadUrl

  return { success: true, waUrl }
}
