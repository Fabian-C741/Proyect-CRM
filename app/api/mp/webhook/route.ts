import { NextRequest, NextResponse } from 'next/server'
import { obtenerPago } from '@/lib/mercadopago'
import { obtenerPedido, marcarPagado } from '@/lib/dal/pedidos'
import { entregarPedido } from '@/lib/dal/entrega'

async function procesarPago(paymentId: string) {
  let pago
  try {
    pago = await obtenerPago(paymentId)
  } catch {
    return
  }

  const pedidoId = pago.externalReference
  if (!pedidoId) return

  const pedido = await obtenerPedido(pedidoId)
  if (!pedido) return
  if (pedido.estado === 'pagado') return

  if (pago.status === 'approved') {
    await marcarPagado(pedido.id, pago.paymentId)
    await entregarPedido(pedido)
  } else if (pago.status === 'rejected' || pago.status === 'cancelled') {
    await ((await import('@/lib/supabase/admin')).getSupabaseAdmin().from('pedidos') as any)
      .update({ estado: 'cancelado', updated_at: new Date().toISOString() })
      .eq('id', pedido.id)
  }
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => ({}))
    if (body?.type === 'payment' && body?.data?.id) {
      await procesarPago(String(body.data.id))
    }
  } else {
    const form = await req.formData().catch(() => null)
    const id = form?.get('data.id') || form?.get('id')
    if (id) await procesarPago(String(id))
  }
  return NextResponse.json({ received: true })
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id') || req.nextUrl.searchParams.get('data.id')
  if (id) await procesarPago(String(id))
  return NextResponse.json({ received: true })
}
