import 'server-only'

const MP_API = 'https://api.mercadopago.com'
const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || ''

export function mercadoPagoHabilitado(): boolean {
  return ACCESS_TOKEN.length > 0
}

export type PreferenciaResult = {
  id: string
  initPoint: string
  sandboxInitPoint: string
}

export async function crearPreferencia(params: {
  pedidoId: string
  titulo: string
  monto: number
  emailComprador?: string
  backUrls: { success: string; pending: string; failure: string }
  notificationUrl: string
}): Promise<PreferenciaResult> {
  if (!mercadoPagoHabilitado()) {
    throw new Error('MercadoPago no está configurado (falta MERCADOPAGO_ACCESS_TOKEN)')
  }

  const res = await fetch(`${MP_API}/checkout/preferences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          id: params.pedidoId,
          title: params.titulo,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: Number(params.monto),
        },
      ],
      payer: params.emailComprador ? { email: params.emailComprador } : undefined,
      back_urls: params.backUrls,
      notification_url: params.notificationUrl,
      auto_return: 'approved',
      external_reference: params.pedidoId,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('[MP] crearPreferencia error', res.status, text)
    throw new Error('No se pudo crear la preferencia de pago')
  }

  const data = (await res.json()) as {
    id: string
    init_point: string
    sandbox_init_point: string
  }

  return { id: data.id, initPoint: data.init_point, sandboxInitPoint: data.sandbox_init_point }
}

export type EstadoPagoMP = {
  paymentId: string
  status: string
  externalReference: string | null
}

export async function obtenerPago(paymentId: string): Promise<EstadoPagoMP> {
  const res = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('[MP] obtenerPago error', res.status, text)
    throw new Error('No se pudo consultar el pago en MercadoPago')
  }
  const data = (await res.json()) as {
    id: number
    status: string
    external_reference: string | null
  }
  return {
    paymentId: String(data.id),
    status: data.status,
    externalReference: data.external_reference,
  }
}
