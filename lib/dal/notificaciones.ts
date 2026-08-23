import 'server-only'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { enviarEmail } from '@/lib/email'
import type { Pedido } from '@/lib/definitions'

export async function avisarAdminNuevoPagoManual(pedido: Pedido): Promise<void> {
  const admin = getSupabaseAdmin()
  const { data: settings } = await (admin.from('site_settings') as any)
    .select('brand_name, whatsapp_number, smtp_from_email, smtp_user')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const s = (settings as {
    brand_name?: string
    whatsapp_number?: string
    smtp_from_email?: string
    smtp_user?: string
  } | null) || {}

  const adminEmail = s.smtp_from_email || s.smtp_user
  if (!adminEmail) {
    console.warn('[notificaciones] no hay email de admin configurado para avisar del pago manual')
    return
  }

  const producto = pedido.tipo || 'producto'
  const monto = `$${Number(pedido.monto).toFixed(2)}`
  const html =
    '<div style="font-family:sans-serif;max-width:520px;margin:auto">' +
    '<h2>Nuevo pago por transferencia pendiente de confirmar</h2>' +
    '<p>Se registró un pago manual de <strong>' + monto + '</strong> para <strong>' + producto + '</strong>.</p>' +
    '<ul>' +
    '<li>Cliente: ' + (pedido.nombre_cliente || '-') + '</li>' +
    '<li>Email: ' + (pedido.email || '-') + '</li>' +
    '<li>Teléfono: ' + (pedido.telefono || '-') + '</li>' +
    '</ul>' +
    '<p>Entrá al panel <strong>Ventas</strong> para revisar el comprobante y aprobar la entrega.</p>' +
    '</div>'

  await enviarEmail({
    to: adminEmail,
    subject: '[' + (s.brand_name || 'CRM') + '] Pago por transferencia pendiente de confirmar',
    html,
  })
}
