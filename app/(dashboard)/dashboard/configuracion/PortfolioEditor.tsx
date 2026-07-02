'use client'

import { useState } from 'react'
import type { PortfolioItem } from '@/lib/definitions'
import { addPortfolioItemAction, deletePortfolioItemAction } from './actions'

type Props = { items: PortfolioItem[] }

export default function PortfolioEditor({ items: initial }: Props) {
  const [items, setItems] = useState(initial)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading('add')
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await addPortfolioItemAction(fd)
    if (result.error) { setError(result.error); setLoading(null); return }
    setAdding(false)
    setLoading(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return
    setLoading(id)
    const result = await deletePortfolioItemAction(id)
    if (result.error) { setError(result.error); setLoading(null); return }
    setItems(prev => prev.filter(i => i.id !== id))
    setLoading(null)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Grid de imágenes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {items.map(item => (
          <div key={item.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
            <div
              style={{
                height: 140,
                background: `url(${item.imagen_url}) center/cover`,
              }}
            />
            {item.descripcion && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  padding: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'white',
                }}
              >
                {item.descripcion}
              </div>
            )}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={loading === item.id}
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                background: 'rgba(239,68,68,0.85)',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 700,
                backdropFilter: 'blur(4px)',
              }}
              title="Eliminar imagen"
            >
              ✕
            </button>
          </div>
        ))}

        {items.length === 0 && !adding && (
          <div
            className="card-glass"
            style={{
              gridColumn: '1 / -1',
              padding: '1.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
            }}
          >
            Aún no tenés fotos en tu portfolio. ¡Agregá tus mejores trabajos!
          </div>
        )}
      </div>

      {/* Formulario para agregar */}
      {adding ? (
        <form onSubmit={handleAdd} className="card-glass p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Agregar Foto</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">URL de la Imagen *</label>
              <input
                name="imagen_url"
                required
                placeholder="https://..."
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Descripción (opcional)</label>
              <input
                name="descripcion"
                placeholder="ej. Maquillaje para novia 2024"
                className="input-base"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            💡 Podés subir fotos a <strong>Imgur</strong>, <strong>Cloudinary</strong> o usar links de Instagram y pegar la URL aquí.
          </p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">Cancelar</button>
            <button type="submit" className="btn-primary text-sm" disabled={loading === 'add'}>
              {loading === 'add' ? 'Guardando...' : 'Agregar Foto'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="btn-secondary w-full justify-center text-sm"
        >
          + Agregar Foto al Portfolio
        </button>
      )}
    </div>
  )
}
