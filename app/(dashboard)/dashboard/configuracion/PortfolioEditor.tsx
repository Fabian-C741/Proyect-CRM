'use client'

import { useState } from 'react'
import type { PortfolioItem } from '@/lib/definitions'
import ImageUploader from '@/app/_components/ImageUploader'
import { addPortfolioItemAction, updatePortfolioItemAction, deletePortfolioItemAction } from './actions'

type Props = { items: PortfolioItem[] }

export default function PortfolioEditor({ items: initial }: Props) {
  const [items, setItems] = useState(initial)
  const [editId, setEditId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading('add'); setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await addPortfolioItemAction(fd)
    if (result.error) { setError(result.error); setLoading(null); return }
    setAdding(false); setLoading(null)
    window.location.reload()
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    setLoading(id); setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await updatePortfolioItemAction(id, fd)
    if (result.error) { setError(result.error); setLoading(null); return }
    setEditId(null); setLoading(null)
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {items.map(item => (
          <div key={item.id} className="card-glass p-3">
            {editId === item.id ? (
              <form onSubmit={e => handleEdit(e, item.id)} className="space-y-3">
                <ImageUploader defaultValue={item.imagen_url} inputName="imagen_url" />
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Descripción</label>
                  <textarea name="descripcion" defaultValue={item.descripcion || ''} rows={3} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Texto del botón (opcional)</label>
                  <input type="text" name="boton_texto" defaultValue={item.boton_texto || ''} placeholder="ej. Ver más" className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Enlace del botón (opcional)</label>
                  <input type="text" name="boton_enlace" defaultValue={item.boton_enlace || ''} placeholder="ej. https://wa.me/..." className="input-base" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setEditId(null)} className="btn-secondary text-xs">Cancelar</button>
                  <button type="submit" className="btn-primary text-xs" disabled={loading === item.id}>
                    {loading === item.id ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', marginBottom: '0.5rem', background: '#1e293b' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imagen_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {item.descripcion && <p className="text-xs text-slate-400 truncate mb-2">{item.descripcion}</p>}
                <div className="flex gap-2">
                  <button onClick={() => setEditId(item.id)} className="btn-secondary text-xs py-1 px-2">✏️ Editar</button>
                  <button onClick={() => handleDelete(item.id)} disabled={loading === item.id} className="btn-secondary text-xs py-1 px-2 text-red-400 border-red-500/20 hover:bg-red-500/10">🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && !adding && (
          <div className="card-glass p-6 text-center text-slate-500 text-sm" style={{ gridColumn: '1 / -1' }}>
            Aún no tenés fotos en tu portfolio. ¡Agregá tus mejores trabajos!
          </div>
        )}
      </div>

      {/* Formulario para agregar */}
      {adding ? (
        <form onSubmit={handleAdd} className="card-glass p-4 space-y-3">
          <p className="text-sm font-semibold text-white mb-2">Agregar Foto</p>
          <ImageUploader inputName="imagen_url" />
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Descripción</label>
            <textarea name="descripcion" rows={3} placeholder="ej. Maquillaje para novia 2024" className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Texto del botón (opcional)</label>
            <input type="text" name="boton_texto" placeholder="ej. Ver más" className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Enlace del botón (opcional)</label>
            <input type="text" name="boton_enlace" placeholder="ej. https://wa.me/..." className="input-base" />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">Cancelar</button>
            <button type="submit" className="btn-primary text-sm" disabled={loading === 'add'}>
              {loading === 'add' ? 'Guardando...' : 'Agregar Foto'}
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="btn-secondary w-full justify-center text-sm">
          + Agregar Foto al Portfolio
        </button>
      )}
    </div>
  )
}
