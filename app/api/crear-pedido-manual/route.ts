import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { crearPedido, obtenerPedido } from '@/lib/dal/pedidos'
import { avisarAdminNuevoPagoManual } from '@/lib/dal/notificaciones'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const cursoId = (form.get('curso_id') as string) || ''
  const nombre = (form.get('nombre') as string) || ''
  const email = (form.get('email') as string) || ''
  const telefono = (form.get('telefono') as string) || ''
  const comprobante = form.get('comprobante') as File | null

  if (!cursoId || !nombre || !telefono) {
    return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()
  const { data: curso, error: cursoErr } = await (admin.from('cursos') as any)
    .select('id, user_id, nombre, precio, tipo, modo_venta')
    .eq('id', cursoId)
    .maybeSingle()

  if (cursoErr || !curso) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }
  if (curso.modo_venta !== 'transferencia') {
    return NextResponse.json({ error: 'Este producto no usa transferencia bancaria' }, { status: 400 })
  }

  let comprobanteUrl: string | null = null
  if (comprobante && comprobante.size > 0) {
    const ext = (comprobante.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `comprobantes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buf = Buffer.from(await comprobante.arrayBuffer())
    const { error: upErr } = await admin.storage
      .from('pdfs')
      .upload(path, buf, { contentType: comprobante.type || 'image/jpeg', upsert: false })
    if (!upErr) {
      const { data: pub } = admin.storage.from('pdfs').getPublicUrl(path)
      comprobanteUrl = pub.publicUrl
    }
  }

  const pedido = await crearPedido({
    user_id: curso.user_id,
    producto_id: curso.id,
    tipo: curso.tipo,
    nombre_cliente: nombre,
    email: email || null,
    telefono,
    monto: Number(curso.precio) || 0,
    estado: 'pendiente_manual',
  })

  if (comprobanteUrl) {
    await (admin.from('pedidos') as any).update({ comprobante_url: comprobanteUrl }).eq('id', pedido.id)
  }

  await avisarAdminNuevoPagoManual(pedido)

  return NextResponse.json({ success: true, pedidoId: pedido.id })
}
