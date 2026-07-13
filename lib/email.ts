import 'server-only'
import nodemailer from 'nodemailer'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function getSmtpConfig() {
  const admin = getSupabaseAdmin()
  const { data } = await admin
    .from('site_settings')
    .select('smtp_host, smtp_port, smtp_user, smtp_pass, smtp_from_email')
    .not('smtp_host', 'is', null)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data as {
    smtp_host: string | null
    smtp_port: number | null
    smtp_user: string | null
    smtp_pass: string | null
    smtp_from_email: string | null
  } | null
}

export async function enviarEmail(params: {
  to: string
  subject: string
  html: string
}) {
  const config = await getSmtpConfig()
  if (!config?.smtp_host || !config.smtp_user || !config.smtp_pass) {
    console.warn('[Email] SMTP no configurado, email no enviado')
    return false
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port || 587,
      secure: config.smtp_port === 465,
      auth: { user: config.smtp_user, pass: config.smtp_pass },
    })

    await transporter.sendMail({
      from: config.smtp_from_email || config.smtp_user,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    return true
  } catch (e) {
    console.error('[Email] Error al enviar:', e)
    return false
  }
}
