import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { enviarEmail } from '@/lib/email'
import type { Pedido } from '@/lib/definitions'

const BUCKET = 'pdfs'
const VIGENCIA_DESCARGA_HORAS = 24

async function generarDownloadUrl(archivoUrl: string): Promise<string | null> {
  if (archivoUrl.startsWith('http')) return archivoUrl
  const filePath = archivoUrl.split('/').pop() || archivoUrl
  if (!filePath) return null
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.storage
    .from(BUCKET)
    .createSignedUrl(filePath, 60 * 60 * VIGENCIA_DESCARGA_HORAS)
  if (error || !data) {
    console.error('[entrega] error signed url:', error)
    return null
  }
  return data.signedUrl
}

export async function entregarPedido(pedido: Pedido): Promise<{ downloadUrl: string | null }> {
  const admin = getSupabaseAdmin()

  let nombreProducto = pedido.tipo || 'tu compra'
  let archivoUrl: string | null = null
  if (pedido.producto_id) {
    const { data: curso } = await (admin.from('cursos') as any)
      .select('nombre, archivo_url')
      .eq('id', pedido.producto_id)
      .maybeSingle()
    if (curso) {
      nombreProducto = curso.nombre
      archivoUrl = curso.archivo_url || null
    }
  }

  const { data: settings } = await (admin.from('site_settings') as any)
    .select('brand_name')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const brandName = (settings as { brand_name?: string } | null)?.brand_name || 'Mi tienda'

  const downloadUrl = archivoUrl ? await generarDownloadUrl(archivoUrl) : null
  if (downloadUrl) {
    const expira = new Date(Date.now() + VIGENCIA_DESCARGA_HORAS * 60 * 60 * 1000)
    await (admin.from('pedidos') as any)
      .update({ download_expires_at: expira.toISOString() })
      .eq('id', pedido.id)
  }

  const cliente = (pedido.nombre_cliente || 'cliente').split(' ')[0]

  if (pedido.email && downloadUrl) {
    const html =
      '<div style="font-family:sans-serif;max-width:500px;margin:auto">' +
      '<h2>¡Gracias por tu compra, ' + cliente + '!</h2>' +
      '<p>Tu archivo <strong>' + nombreProducto + '</strong> está listo para descargar.</p>' +
      '<p style="margin:24px 0"><a href="' + downloadUrl + '" style="background:#ec4899;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">DESCARGAR AHORA</a></p>' +
      '<p style="color:#666;font-size:13px">Este link expira en ' + VIGENCIA_DESCARGA_HORAS + ' horas.</p>' +
      '</div>'
    await enviarEmail({
      to: pedido.email,
      subject: 'Tu compra en ' + brandName + ' - ' + nombreProducto,
      html,
    })
  }

  if (pedido.telefono && downloadUrl) {
    const msg = encodeURIComponent(
      'Hola ' + cliente + '! Acabás de comprar "' + nombreProducto + '". Tu link de descarga: ' + downloadUrl + ' (válido ' + VIGENCIA_DESCARGA_HORAS + 'h).'
    )
    const waUrl = 'https://wa.me/' + pedido.telefono.replace(/\D/g, '') + '?text=' + msg
    console.log('[entrega] link de descarga para el comprador por WhatsApp:', waUrl)
  }

  return { downloadUrl }
}
