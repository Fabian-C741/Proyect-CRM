'use client'

import { useState } from 'react'
import { saveSeccionesAction } from './actions'
import { TIPOS_PRODUCTO_INFO, type TipoProducto, type SeccionLandingConfig, type SeccionesLanding } from '@/lib/definitions'

const TIPOS: TipoProducto[] = ['servicio', 'curso', 'pdf', 'ebook']

type EstadoPorTipo = Record<TipoProducto, SeccionLandingConfig>

function estadoInicial(config: SeccionesLanding | null): EstadoPorTipo {
  const estado = {} as EstadoPorTipo
  for (const tipo of TIPOS) {
    const guardado = config?.[tipo]
    estado[tipo] = {
      visible: guardado?.visible !== false,
      titulo: guardado?.titulo || '',
      descripcion: guardado?.descripcion || '',
    }
  }
  return estado
}

export default function SeccionesEditor({ configInicial }: { configInicial: SeccionesLanding | null }) {
  const [estado, setEstado] = useState<EstadoPorTipo>(() => estadoInicial(configInicial))
  const [guardando, setGuardando] = useState(false)
  const [message, setMessage] = useState('')

  const actualizar = (tipo: TipoProducto, campo: keyof SeccionLandingConfig, valor: string | boolean) => {
    setEstado(prev => ({ ...prev, [tipo]: { ...prev[tipo], [campo]: valor } }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setGuardando(true)
    setMessage('')

    const fd = new FormData()
    fd.set('secciones', JSON.stringify(estado))
    const result = await saveSeccionesAction(fd)

    if (result.error) setMessage(result.error)
    else setMessage('✅ Secciones actualizadas. Los cambios ya están en tu landing.')

    setGuardando(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-slate-400 text-sm">
        Personalizá el título y la descripción de cada sección de tu landing, u ocultá las que no uses.
        Si dejás un campo vacío se usa el texto por defecto.
      </p>

      {message && (
        <div style={{ padding: '1rem', borderRadius: 8, background: message.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.startsWith('✅') ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {TIPOS.map(tipo => {
          const info = TIPOS_PRODUCTO_INFO[tipo]
          const cfg = estado[tipo]
          return (
            <div key={tipo} className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3" style={{ opacity: cfg.visible === false ? 0.55 : 1, transition: 'opacity 0.2s' }}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-sm">{info.icon} {info.label}</span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={cfg.visible !== false}
                    onChange={e => actualizar(tipo, 'visible', e.target.checked)}
                    style={{ width: 15, height: 15, accentColor: '#ec4899', cursor: 'pointer' }}
                  />
                  <span className="text-xs text-slate-400">Visible</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Título</label>
                <input
                  type="text"
                  value={cfg.titulo || ''}
                  onChange={e => actualizar(tipo, 'titulo', e.target.value)}
                  placeholder={info.label}
                  maxLength={120}
                  className="input-base text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Descripción / Mensaje</label>
                <textarea
                  value={cfg.descripcion || ''}
                  onChange={e => actualizar(tipo, 'descripcion', e.target.value)}
                  placeholder={info.desc}
                  maxLength={400}
                  rows={2}
                  className="input-base text-sm"
                  style={{ resize: 'none' }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar Secciones'}
        </button>
      </div>
    </form>
  )
}
