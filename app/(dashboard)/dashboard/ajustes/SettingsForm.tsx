'use client'

import { useState } from 'react'
import { updateSiteSettings } from './actions'

export default function SettingsForm({ initialData }: { initialData: any }) {
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
        <label htmlFor="brandName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre de tu Marca</label>
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
        <label htmlFor="heroTitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Título Principal (Landing Page)</label>
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
        <label htmlFor="heroSubtitle" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Subtítulo / Descripción</label>
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
        <label htmlFor="heroCtaText" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Texto del Botón Principal</label>
        <input 
          type="text" 
          id="heroCtaText" 
          name="heroCtaText" 
          defaultValue={initialData.hero_cta_text} 
          className="input-base" 
          required 
        />
      </div>

      <div>
        <label htmlFor="whatsappNumber" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Número de WhatsApp</label>
        <input 
          type="text" 
          id="whatsappNumber" 
          name="whatsappNumber" 
          defaultValue={initialData.whatsapp_number} 
          className="input-base" 
          placeholder="Ej: 5491112345678"
          required 
        />
        <small style={{ color: 'var(--text-muted)' }}>Incluye código de país sin el símbolo +. Ej para Argentina: 54911...</small>
      </div>

      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </form>
  )
}
