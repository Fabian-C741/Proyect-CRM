'use client'

import { useState } from 'react'
import { createCursoAction } from './actions'

const TIPOS = [
  { value: 'servicio', label: '💆 Servicio (maquillaje, etc.)' },
  { value: 'curso', label: '🎓 Curso Online' },
  { value: 'pdf', label: '📄 PDF Descargable' },
  { value: 'ebook', label: '📚 eBook' },
]

const MODOS_VENTA = [
  { value: 'whatsapp', label: '💬 Consultar por WhatsApp' },
  { value: 'link_externo', label: '🔗 Link Externo (MercadoPago, Hotmart, etc.)' },
  { value: 'mensaje', label: '✉️ Mensaje personalizado' },
]

export default function NuevoCursoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modoVenta, setModoVenta] = useState('whatsapp')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createCursoAction(formData)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setIsOpen(false)
      setIsPending(false)
      setModoVenta('whatsapp')
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo Producto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-surface-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Nuevo Producto / Servicio</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>
              )}

              {/* Tipo */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipo de Producto *</label>
                <select name="tipo" className="input-base">
                  {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {/* Nombre */}
              <div>
                <label htmlFor="new-nombre" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre *</label>
                <input id="new-nombre" name="nombre" type="text" required placeholder="ej. Curso Automaquillaje Social" className="input-base" />
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="new-desc" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descripción</label>
                <textarea id="new-desc" name="descripcion" rows={3} placeholder="Qué incluye, para quién es, qué aprenderán..." className="input-base" style={{ resize: 'none' }} />
              </div>

              {/* Precio y Duración */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new-precio" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Precio ($) *</label>
                  <input id="new-precio" name="precio" type="number" step="0.01" min="0" required placeholder="ej. 15000" className="input-base" />
                </div>
                <div>
                  <label htmlFor="new-duracion" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Duración (Horas)</label>
                  <input id="new-duracion" name="duracion" type="number" step="0.5" min="0" max="999" placeholder="ej. 2.5" className="input-base" />
                </div>
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">URL de Imagen</label>
                <input name="imagen_url" type="text" placeholder="https://... (foto del producto/curso)" className="input-base" />
              </div>

              {/* Modo de Venta */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">¿Cómo se compra?</label>
                <select
                  name="modo_venta"
                  className="input-base"
                  value={modoVenta}
                  onChange={e => setModoVenta(e.target.value)}
                >
                  {MODOS_VENTA.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              {/* Campo condicional: Link Externo */}
              {modoVenta === 'link_externo' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Link de Pago</label>
                  <input name="link_externo" type="url" placeholder="https://mpago.la/... o link de Hotmart" className="input-base" />
                  <p className="text-xs text-slate-500 mt-1">MercadoPago, Hotmart, Gumroad, Notion, Google Drive, etc.</p>
                </div>
              )}

              {/* Campo condicional: Mensaje WhatsApp */}
              {modoVenta === 'mensaje' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mensaje personalizado</label>
                  <input name="mensaje_whatsapp" type="text" placeholder="ej. Hola! Quiero comprar el eBook de maquillaje" className="input-base" />
                </div>
              )}

              {/* Mostrar en landing */}
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <input
                  type="hidden"
                  name="mostrar_en_landing"
                  value="false"
                />
                <input
                  id="new-landing"
                  name="mostrar_en_landing"
                  type="checkbox"
                  value="true"
                  defaultChecked
                  style={{ width: 16, height: 16, accentColor: '#ec4899', cursor: 'pointer' }}
                />
                <label htmlFor="new-landing" className="text-sm text-slate-300 cursor-pointer">
                  Mostrar en mi landing pública
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary" disabled={isPending}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
