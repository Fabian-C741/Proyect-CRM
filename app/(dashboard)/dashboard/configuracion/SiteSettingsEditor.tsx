'use client'

import { useState, useTransition } from 'react'
import type { SiteSettings } from '@/lib/definitions'
import { saveSiteSettingsAction } from './actions'

type Props = { settings: SiteSettings | null }

export default function SiteSettingsEditor({ settings }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaved(false)
    setError(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await saveSiteSettingsAction(fd)
      if (result.error) { setError(result.error); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>
      )}
      {saved && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg">
          ✓ Cambios guardados correctamente. Los verás reflejados en tu landing en segundos.
        </div>
      )}

      {/* Sección Marca */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-white/5 pb-2">Identidad de Marca</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre del Negocio</label>
            <input name="brand_name" defaultValue={settings?.brand_name || ''} placeholder="ej. Estudio de Maquillaje Luna" className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Número WhatsApp</label>
            <input name="whatsapp_number" defaultValue={settings?.whatsapp_number || ''} placeholder="ej. 5491112345678 (sin + ni espacios)" className="input-base" />
            <p className="text-xs text-slate-500 mt-1">Código de país + número sin espacios. Ej: 5491112345678</p>
          </div>
        </div>
      </div>

      {/* Sección Hero */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-white/5 pb-2">Sección Principal (Hero)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Título Principal</label>
            <input name="hero_title" defaultValue={settings?.hero_title || ''} placeholder="ej. Realza tu belleza natural" className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subtítulo / Descripción</label>
            <textarea
              name="hero_subtitle"
              defaultValue={settings?.hero_subtitle || ''}
              rows={2}
              placeholder="ej. Servicios profesionales de maquillaje para eventos, novias y cursos."
              className="input-base"
              style={{ resize: 'none' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Texto del Botón Principal</label>
            <input name="hero_cta_text" defaultValue={settings?.hero_cta_text || ''} placeholder="ej. Reserva tu turno" className="input-base" />
          </div>
        </div>
      </div>

      {/* Sección Sobre Mí */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 border-b border-white/5 pb-2">Sobre Mí</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mi Bio</label>
            <textarea
              name="sobre_mi_texto"
              defaultValue={settings?.sobre_mi_texto || ''}
              rows={4}
              placeholder="Contá tu historia, tu experiencia, qué te diferencia..."
              className="input-base"
              style={{ resize: 'none' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">URL de mi foto</label>
            <input
              name="sobre_mi_imagen_url"
              defaultValue={settings?.sobre_mi_imagen_url || ''}
              placeholder="https://... (link a tu foto)"
              className="input-base"
            />
            {settings?.sobre_mi_imagen_url && (
              <div
                style={{
                  marginTop: '0.5rem',
                  width: 80, height: 80,
                  borderRadius: '50%',
                  background: `url(${settings.sobre_mi_imagen_url}) center/cover`,
                  border: '2px solid rgba(236,72,153,0.3)',
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? 'Guardando...' : '💾 Guardar Configuración'}
        </button>
      </div>
    </form>
  )
}
