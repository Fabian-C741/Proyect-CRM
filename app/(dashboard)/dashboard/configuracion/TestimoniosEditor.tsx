'use client'

import { useState } from 'react'
import type { Testimonio } from '@/lib/definitions'
import { createTestimonioAction, deleteTestimonioAction } from './actions'

type Props = { testimonios: Testimonio[] }

export default function TestimoniosEditor({ testimonios: initial }: Props) {
  const [testimonios, setTestimonios] = useState(initial)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading('add')
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await createTestimonioAction(fd)
    if (result.error) { setError(result.error); setLoading(null); return }
    setAdding(false)
    setLoading(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este testimonio?')) return
    setLoading(id)
    const result = await deleteTestimonioAction(id)
    if (result.error) { setError(result.error); setLoading(null); return }
    setTestimonios(prev => prev.filter(t => t.id !== id))
    setLoading(null)
  }

  const Stars = ({ n }: { n: number }) => (
    <span style={{ color: '#facc15', fontSize: '0.875rem' }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {testimonios.map(t => (
          <div key={t.id} className="card-glass p-4 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-white text-sm">{t.nombre_cliente}</p>
                <Stars n={t.estrellas} />
              </div>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={loading === t.id}
                className="btn-secondary text-xs py-1 px-2 text-red-400 border-red-500/20 hover:bg-red-500/10 shrink-0"
              >
                🗑️
              </button>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">&quot;{t.texto}&quot;</p>
          </div>
        ))}

        {testimonios.length === 0 && !adding && (
          <div
            className="card-glass col-span-full"
            style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}
          >
            Aún no tenés testimonios. Los testimonios generan confianza en tus clientes.
          </div>
        )}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="card-glass p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Nuevo Testimonio</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre del Cliente *</label>
              <input name="nombre_cliente" required placeholder="ej. María García" className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estrellas</label>
              <select name="estrellas" className="input-base" defaultValue="5">
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Reseña *</label>
            <textarea
              name="texto"
              required
              rows={3}
              placeholder="ej. Quedé encantada con el maquillaje, muy profesional..."
              className="input-base"
              style={{ resize: 'none' }}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">Cancelar</button>
            <button type="submit" className="btn-primary text-sm" disabled={loading === 'add'}>
              {loading === 'add' ? 'Guardando...' : 'Agregar Testimonio'}
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-secondary w-full justify-center text-sm">
          + Agregar Testimonio
        </button>
      )}
    </div>
  )
}
