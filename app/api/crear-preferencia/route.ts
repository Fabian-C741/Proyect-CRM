import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { crearPreferencia, mercadoPagoHabilitado } from '@/lib/mercadopago'
import { crearPedido, obtenerPorPreference } from '@/lib/dal/pedidos'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || ''

export async function POST(req: NextRequest) {
  if (!(await mercadoPagoHabilitado())) {
    return NextResponse.json({ error: 'MercadoPago no está configurado' }, { status: 500 })
  }

  const form = await req.formData()
  const cursoId = (form.get('curso_id') as string) || ''
  const nombre = (form.get('nombre') as string) || ''
  const email = (form.get('email') as string) || ''
  const telefono = (form.get('telefono') as string) || ''

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
  if (curso.modo_venta !== 'mercadopago') {
    return NextResponse.json({ error: 'Este producto no usa MercadoPago' }, { status: 400 })
  }

  const pedido = await crearPedido({
    user_id: curso.user_id,
    producto_id: curso.id,
    tipo: curso.tipo,
    nombre_cliente: nombre,
    email: email || null,
    telefono,
    monto: Number(curso.precio) || 0,
    estado: 'pendiente',
  })

  let preferencia
  try {
    preferencia = await crearPreferencia({
      pedidoId: pedido.id,
      titulo: curso.nombre,
      monto: Number(curso.precio) || 0,
      emailComprador: email || undefined,
      backUrls: {
        success: `${APP_URL}/`,
        pending: `${APP_URL}/`,
        failure: `${APP_URL}/`,
      },
      notificationUrl: `${APP_URL}/api/mp/webhook`,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error al crear el pago' }, { status: 500 })
  }

  await (admin.from('pedidos') as any)
    .update({ mp_preference_id: preferencia.id })
    .eq('id', pedido.id)

  return NextResponse.json({ initPoint: preferencia.initPoint || preferencia.sandboxInitPoint })
}
