'use client'

import { useState } from 'react'
import { updateSiteSettings } from './actions'
import ImageUploader from '@/app/_components/ImageUploader'

export default function SettingsForm({ initialData, mpConfigured }: { initialData: any; mpConfigured?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    const result = await updateSiteSettings(formData)
    
    if (result.success) {
      setMessage('✅ Ajustes guardados correctamente. Los cambios ya están en vivo.')
    } else {
      setMessage('❌ ' + result.error)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card-glass" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Los cambios que hagas aquí se reflejarán instantáneamente en tu Landing Page pública y en la pantalla de Login.
      </p>

      {message && (
        <div style={{ padding: '1rem', borderRadius: '8px', background: message.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('✅') ? '#10b981' : '#ef4444' }}>
          {message}
        </div>
      )}

      <div>
        <label htmlFor="brandName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre de tu Marca</label>
        <input 
          type="text" 
          id="brandName" 
          name="brandName" 
          defaultValue={initialData.brand_name} 
          className="input-base" 
          required 
        />
        <small style={{ color: 'var(--text-muted)' }}>Aparece en el Login y en la barra de navegación pública.</small>
      </div>

      <div>
        <label htmlFor="heroTitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Título Principal (Landing Page)</label>
        <input 
          type="text" 
          id="heroTitle" 
          name="heroTitle" 
          defaultValue={initialData.hero_title} 
          className="input-base" 
          required 
        />
      </div>

      <div>
        <label htmlFor="heroSubtitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subtítulo / Descripción</label>
        <textarea 
          id="heroSubtitle" 
          name="heroSubtitle" 
          defaultValue={initialData.hero_subtitle} 
          className="input-base" 
          rows={3}
          required 
        />
      </div>

      <div>
        <label htmlFor="heroCtaText" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Texto del Botón Principal</label>
        <input 
          type="text" 
          id="heroCtaText" 
          name="heroCtaText" 
          defaultValue={initialData.hero_cta_text} 
          className="input-base" 
          required 
        />
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>WhatsApp / Contacto</p>
        <div>
          <label htmlFor="whatsappNumber" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Número de WhatsApp</label>
          <input 
            type="text" 
            id="whatsappNumber" 
            name="whatsappNumber" 
            defaultValue={initialData.whatsapp_number || ''} 
            className="input-base" 
            placeholder="Ej: 5491123456789"
          />
          <small style={{ color: 'var(--text-muted)' }}>Se usa en todos los botones de WhatsApp de la landing. Sin + ni espacios.</small>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Favicon (icono de la pestaña)</p>
        <ImageUploader defaultValue={initialData.favicon_url} inputName="faviconUrl" label="Favicon" size="sm" />
        <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>Imagen cuadrada chica (32x32 o 64x64).</small>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Ícono App (PWA / APK)</p>
        <ImageUploader defaultValue={initialData.pwa_icon_url} inputName="pwaIconUrl" label="Ícono de App" size="sm" />
        <small style={{ color: 'var(--text-muted)' }}>Imagen cuadrada, mínimo 512x512. Se usará como ícono de la app instalada.</small>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Sección CTA Final (¿Lista para tu transformación?)</p>
        <div>
          <label htmlFor="ctaTitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Título</label>
          <input type="text" id="ctaTitle" name="ctaTitle" defaultValue={initialData.cta_title || ''} className="input-base" placeholder="¿Lista para tu transformación?" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="ctaText" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Texto</label>
          <textarea id="ctaText" name="ctaText" defaultValue={initialData.cta_text || ''} rows={3} className="input-base" placeholder="Reservá tu turno hoy y empezá a sentirte increíble..." />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="ctaButtonText" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Texto del Botón</label>
          <input type="text" id="ctaButtonText" name="ctaButtonText" defaultValue={initialData.cta_button_text || ''} className="input-base" placeholder="Reservar mi turno" />
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Sección Sobre Mí</p>
        <div>
          <label htmlFor="sobreMiTexto" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Texto</label>
          <textarea 
            id="sobreMiTexto" 
            name="sobreMiTexto" 
            defaultValue={initialData.sobre_mi_texto || ''} 
            className="input-base" 
            rows={4}
            placeholder="Contá quién sos, tu experiencia, tu enfoque..."
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Foto / Imagen (subí o pegá una URL)</label>
          <ImageUploader defaultValue={initialData.sobre_mi_imagen_url} inputName="sobreMiImagenUrl" label="Foto Sobre Mí" size="sm" />
          <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Foto tuya o imagen representativa. Se muestra circular.</small>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Datos Bancarios (pagos por transferencia)</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Se muestran al cliente cuando paga un producto por transferencia bancaria.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="titularCuenta" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Titular de la cuenta</label>
            <input type="text" id="titularCuenta" name="titularCuenta" defaultValue={initialData.titular_cuenta || ''} className="input-base" placeholder="Tu nombre completo" />
          </div>
          <div>
            <label htmlFor="banco" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Banco</label>
            <input type="text" id="banco" name="banco" defaultValue={initialData.banco || ''} className="input-base" placeholder="Ej: Banco Nación" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4" style={{ marginTop: '1rem' }}>
          <div>
            <label htmlFor="cbu" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CBU</label>
            <input type="text" id="cbu" name="cbu" defaultValue={initialData.cbu || ''} className="input-base" />
          </div>
          <div>
            <label htmlFor="aliasCbu" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alias</label>
            <input type="text" id="aliasCbu" name="aliasCbu" defaultValue={initialData.alias_cbu || ''} className="input-base" placeholder="Ej: estudio.luna.mp" />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>Configuración de Email (SMTP)</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Necesario para enviar links de descarga de PDFs a los compradores.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="smtpHost" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Servidor SMTP</label>
            <input type="text" id="smtpHost" name="smtpHost" defaultValue={initialData.smtp_host || ''} className="input-base" placeholder="smtp.gmail.com" />
          </div>
          <div>
            <label htmlFor="smtpPort" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Puerto</label>
            <input type="number" id="smtpPort" name="smtpPort" defaultValue={initialData.smtp_port || 587} className="input-base" placeholder="587" />
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="smtpUser" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usuario</label>
          <input type="text" id="smtpUser" name="smtpUser" defaultValue={initialData.smtp_user || ''} className="input-base" placeholder="tu@email.com" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="smtpPass" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña</label>
          <input type="password" id="smtpPass" name="smtpPass" defaultValue={initialData.smtp_pass || ''} className="input-base" placeholder="••••••••" />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="smtpFromEmail" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Remitente</label>
          <input type="email" id="smtpFromEmail" name="smtpFromEmail" defaultValue={initialData.smtp_from_email || ''} className="input-base" placeholder="tunegocio@email.com" />
          <small style={{ color: 'var(--text-muted)' }}>El email desde el cual se enviarán los links de descarga.</small>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
        <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'white' }}>MercadoPago</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Pegá tu token de acceso para cobrar automáticamente con MercadoPago. Se guarda en una tabla protegida que nadie puede ver desde la web.
        </p>
        <div style={{
          padding: '0.5rem 0.75rem',
          borderRadius: '8px',
          display: 'inline-block',
          marginBottom: '1rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          background: mpConfigured ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          color: mpConfigured ? '#10b981' : '#f59e0b',
        }}>
          {mpConfigured ? '✓ Token configurado — los pagos están activos' : '⚠ Sin token — MercadoPago desactivado'}
        </div>
        <div>
          <label htmlFor="mpAccessToken" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Token de acceso (Access Token)</label>
          <input
            type="password"
            id="mpAccessToken"
            name="mpAccessToken"
            className="input-base"
            placeholder={mpConfigured ? '•••••••••••• (dejalo vacío para mantener el actual)' : 'APP_USR-...'}
          />
          <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
            Lo sacás de MercadoPago → Tu negocio → Integraciones → Credenciales de producción.
          </small>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: '0.5rem' }}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}
