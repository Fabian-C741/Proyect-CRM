'use client'

import { useState } from 'react'
import type { Curso } from '@/lib/definitions'
import { updateCursoAction } from './actions'

const TIPOS = [
  { value: 'servicio', label: '💆 Servicio' },
  { value: 'curso', label: '🎓 Curso Online' },
  { value: 'pdf', label: '📄 PDF Descargable' },
  { value: 'ebook', label: '📚 eBook' },
]

const MODOS_VENTA = [
  { value: 'whatsapp', label: '💬 Consultar por WhatsApp' },
  { value: 'link_externo', label: '🔗 Link Externo' },
  { value: 'mensaje', label: '✉️ Mensaje personalizado' },
]

type Props = { curso: Curso; onClose: () => void }

export default function EditarCursoModal({ curso, onClose }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modoVenta, setModoVenta] = useState<'whatsapp' | 'link_externo' | 'mensaje'>(curso.modo_venta || 'whatsapp')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await updateCursoAction(curso.id, formData)
    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      onClose()
      window.location.reload()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-surface-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Editar Producto</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipo</label>
            <select name="tipo" defaultValue={curso.tipo || 'servicio'} className="input-base">
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre *</label>
            <input name="nombre" type="text" required defaultValue={curso.nombre} className="input-base" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Descripción</label>
            <textarea name="descripcion" rows={3} defaultValue={curso.descripcion || ''} className="input-base" style={{ resize: 'none' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Precio ($) *</label>
              <input name="precio" type="number" step="0.01" min="0" required defaultValue={curso.precio} className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Duración (Horas)</label>
              <input name="duracion" type="number" step="0.5" min="0" defaultValue={curso.duracion_horas || ''} className="input-base" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">URL de Imagen</label>
            <input name="imagen_url" type="text" defaultValue={curso.imagen_url || ''} placeholder="https://..." className="input-base" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">¿Cómo se compra?</label>
            <select name="modo_venta" className="input-base" value={modoVenta} onChange={e => setModoVenta(e.target.value as 'whatsapp' | 'link_externo' | 'mensaje')}>
              {MODOS_VENTA.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          {modoVenta === 'link_externo' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Link de Pago</label>
              <input name="link_externo" type="url" defaultValue={curso.link_externo || ''} placeholder="https://mpago.la/..." className="input-base" />
            </div>
          )}

          {modoVenta === 'mensaje' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mensaje personalizado</label>
              <input name="mensaje_whatsapp" type="text" defaultValue={curso.mensaje_whatsapp || ''} placeholder="ej. Hola! Quiero comprar el eBook" className="input-base" />
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
            <input type="hidden" name="mostrar_en_landing" value="false" />
            <input
              id="edit-landing"
              name="mostrar_en_landing"
              type="checkbox"
              value="true"
              defaultChecked={curso.mostrar_en_landing !== false}
              style={{ width: 16, height: 16, accentColor: '#ec4899', cursor: 'pointer' }}
            />
            <label htmlFor="edit-landing" className="text-sm text-slate-300 cursor-pointer">
              Mostrar en mi landing pública
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={isPending}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
