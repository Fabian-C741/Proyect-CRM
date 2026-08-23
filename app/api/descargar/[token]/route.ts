import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { obtenerPorToken } from '@/lib/dal/pedidos'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const pedido = await obtenerPorToken(token)
  if (!pedido || pedido.estado !== 'pagado') {
    return new NextResponse('El link de descarga no es válido o el pago no fue confirmado.', { status: 403 })
  }
  if (pedido.download_expires_at && new Date(pedido.download_expires_at) < new Date()) {
    return new NextResponse('Este link de descarga expiró.', { status: 410 })
  }

  const admin = getSupabaseAdmin()
  const { data: curso } = await (admin.from('cursos') as any)
    .select('archivo_url')
    .eq('id', pedido.producto_id)
    .maybeSingle()
  const archivoUrl = (curso as { archivo_url?: string } | null)?.archivo_url
  if (!archivoUrl) {
    return new NextResponse('Archivo no disponible.', { status: 404 })
  }

  if (archivoUrl.startsWith('http')) {
    return NextResponse.redirect(archivoUrl)
  }

  const filePath = archivoUrl.split('/').pop()
  if (!filePath) return new NextResponse('Archivo inválido.', { status: 400 })

  const { data, error } = await admin.storage
    .from('pdfs')
    .createSignedUrl(filePath, 60 * 60 * 24)

  if (error || !data) {
    return new NextResponse('No se pudo generar la descarga.', { status: 500 })
  }

  return NextResponse.redirect(data.signedUrl)
}
