'use client'

import { useState } from 'react'
import type { Servicio } from '@/lib/definitions'
import {
  createServicioAction,
  updateServicioAction,
  deleteServicioAction,
  seedServiciosAction,
} from './actions'

type Props = { servicios: Servicio[] }

export default function ServiciosEditor({ servicios: initial }: Props) {
  const [servicios, setServicios] = useState(initial)
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading('add')
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await createServicioAction(fd)
    if (result.error) { setError(result.error); setLoading(null); return }
    setAdding(false)
    setLoading(null)
    window.location.reload()
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    setLoading(id)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await updateServicioAction(id, fd)
    if (result.error) { setError(result.error); setLoading(null); return }
    setEditId(null)
    setLoading(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este servicio?')) return
    setLoading(id + '-del')
    const result = await deleteServicioAction(id)
    if (result.error) { setError(result.error); setLoading(null); return }
    setServicios(prev => prev.filter(s => s.id !== id))
    setLoading(null)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de servicios */}
      <div className="grid grid-cols-1 gap-3">
        {servicios.map(s => (
          <div key={s.id} className="card-glass p-4">
            {editId === s.id ? (
              <form onSubmit={e => handleEdit(e, s.id)} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre *</label>
                    <input name="nombre" defaultValue={s.nombre} required className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Descripción</label>
                    <input name="descripcion" defaultValue={s.descripcion || ''} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Precio ($)</label>
                    <input name="precio" type="number" step="0.01" min="0" defaultValue={s.precio || 0} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Duración (min)</label>
                    <input name="duracion_minutos" type="number" min="0" defaultValue={s.duracion_minutos || ''} className="input-base" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">URL de Imagen</label>
                    <input name="imagen_url" defaultValue={s.imagen_url || ''} placeholder="https://..." className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Orden</label>
                    <input name="orden" type="number" min="0" defaultValue={s.orden || 0} className="input-base" />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input name="activo" type="checkbox" defaultChecked={s.activo} className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-pink-500 focus:ring-pink-500" />
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activo</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setEditId(null)} className="btn-secondary text-sm py-1">Cancelar</button>
                  <button type="submit" className="btn-primary text-sm py-1" disabled={loading === s.id}>
                    {loading === s.id ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-4">
                {s.imagen_url && (
                  <div
                    style={{
                      width: 56, height: 56, borderRadius: 8, flexShrink: 0,
                      background: `url(${s.imagen_url}) center/cover`,
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{s.nombre}</p>
                  {s.descripcion && <p className="text-sm text-slate-400 truncate">{s.descripcion}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEditId(s.id)}
                    className="btn-secondary text-xs py-1 px-3"
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="btn-secondary text-xs py-1 px-3 text-red-400 border-red-500/20 hover:bg-red-500/10"
                    disabled={loading === s.id + '-del'}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {servicios.length === 0 && !adding && (
          <div className="card-glass p-6 text-center space-y-4">
            <p className="text-slate-500 text-sm">No tenés servicios cargados.</p>
            <button
              onClick={async () => {
                setLoading('seed')
                setError(null)
                const result = await seedServiciosAction()
                if (result.error) { setError(result.error); setLoading(null); return }
                setLoading(null)
                window.location.reload()
              }}
              className="btn-primary text-sm"
              disabled={loading === 'seed'}
            >
              {loading === 'seed' ? 'Creando...' : '✨ Crear servicios de ejemplo'}
            </button>
          </div>
        )}
      </div>

      {/* Formulario para agregar */}
      {adding ? (
        <form onSubmit={handleAdd} className="card-glass p-4 space-y-3">
          <p className="text-sm font-semibold text-white mb-2">Nuevo Servicio</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre *</label>
              <input name="nombre" required placeholder="ej. Maquillaje Social" className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Descripción</label>
              <input name="descripcion" placeholder="Breve descripción" className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Precio ($)</label>
              <input name="precio" type="number" step="0.01" min="0" placeholder="0" className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Duración (min)</label>
              <input name="duracion_minutos" type="number" min="0" placeholder="60" className="input-base" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">URL de Imagen</label>
              <input name="imagen_url" placeholder="https://images.unsplash.com/..." className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Orden</label>
              <input name="orden" type="number" min="0" placeholder="0" className="input-base" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input name="activo" type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-pink-500 focus:ring-pink-500" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activo</span>
              </label>
            </div>
          </div>
          <p className="text-xs text-slate-500">💡 Podés usar imágenes de Unsplash, tu Instagram o cualquier URL pública.</p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">Cancelar</button>
            <button type="submit" className="btn-primary text-sm" disabled={loading === 'add'}>
              {loading === 'add' ? 'Guardando...' : 'Agregar Servicio'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="btn-secondary w-full justify-center text-sm"
        >
          + Agregar Servicio
        </button>
      )}
    </div>
  )
}
