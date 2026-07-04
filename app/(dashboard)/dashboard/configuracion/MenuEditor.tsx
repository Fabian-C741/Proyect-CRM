'use client'

import { useState } from 'react'
import type { MenuItem } from '@/lib/definitions'
import {
  createMenuItemAction,
  updateMenuItemAction,
  deleteMenuItemAction,
} from './actions'

type Props = { menuItems: MenuItem[] }

export default function MenuEditor({ menuItems }: Props) {
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Encontrar elementos raíz para usar como posibles "padres" en los dropdowns
  const parentOptions = menuItems.filter(item => !item.parent_id)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading('add')
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await createMenuItemAction(fd)
    if (result.error) {
      setError(result.error)
      setLoading(null)
      return
    }
    setAdding(false)
    setLoading(null)
    window.location.reload()
  }

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()
    setLoading(id)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await updateMenuItemAction(id, fd)
    if (result.error) {
      setError(result.error)
      setLoading(null)
      return
    }
    setEditId(null)
    setLoading(null)
    window.location.reload()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este elemento de menú? Si tiene submenús, también se eliminarán.')) return
    setLoading(id + '-del')
    const result = await deleteMenuItemAction(id)
    if (result.error) {
      setError(result.error)
      setLoading(null)
      return
    }
    setLoading(null)
    window.location.reload()
  }

  // Agrupar visualmente padres e hijos para mostrarlos anidados en la lista
  const roots = menuItems.filter(item => !item.parent_id)

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Lista de Enlaces de Navegación */}
      <div className="space-y-2">
        {roots.map(root => {
          const children = menuItems.filter(child => child.parent_id === root.id)
          return (
            <div key={root.id} className="space-y-2">
              {/* Item Raíz */}
              <div className="card-glass p-4">
                {editId === root.id ? (
                  <form onSubmit={e => handleEdit(e, root.id)} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre *</label>
                        <input name="label" defaultValue={root.label} required className="input-base text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Enlace / Ancla</label>
                        <input name="href" defaultValue={root.href || ''} placeholder="ej. #servicios o /agenda" className="input-base text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Orden</label>
                        <input name="orden" type="number" defaultValue={root.orden} className="input-base text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                        <select name="activo" defaultValue={root.activo ? 'true' : 'false'} className="input-base text-sm">
                          <option value="true">Activo</option>
                          <option value="false">Inactivo</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setEditId(null)} className="btn-secondary text-xs py-1">Cancelar</button>
                      <button type="submit" className="btn-primary text-xs py-1" disabled={loading === root.id}>
                        {loading === root.id ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">{root.label}</span>
                        {!root.activo && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold uppercase">Inactivo</span>}
                        {children.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-400 font-bold uppercase">Dropdown</span>}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        Enlace: <code className="bg-white/5 px-1 py-0.5 rounded">{root.href || '(Menú Desplegable)'}</code> • Orden: {root.orden}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditId(root.id)} className="btn-secondary text-xs py-1 px-3">✏️</button>
                      <button
                        onClick={() => handleDelete(root.id)}
                        className="btn-secondary text-xs py-1 px-3 text-red-400 border-red-500/20 hover:bg-red-500/10"
                        disabled={loading === root.id + '-del'}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-items (Hijos de este dropdown) */}
              {children.map(child => (
                <div key={child.id} className="ml-8 card-glass p-3 border-l-2 border-pink-500/30">
                  {editId === child.id ? (
                    <form onSubmit={e => handleEdit(e, child.id)} className="space-y-3">
                      <input type="hidden" name="parent_id" value={root.id} />
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre *</label>
                          <input name="label" defaultValue={child.label} required className="input-base text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Enlace / Ancla</label>
                          <input name="href" defaultValue={child.href || ''} placeholder="ej. #servicios o /agenda" className="input-base text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Orden</label>
                          <input name="orden" type="number" defaultValue={child.orden} className="input-base text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estado</label>
                          <select name="activo" defaultValue={child.activo ? 'true' : 'false'} className="input-base text-sm">
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditId(null)} className="btn-secondary text-xs py-1">Cancelar</button>
                        <button type="submit" className="btn-primary text-xs py-1" disabled={loading === child.id}>
                          {loading === child.id ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-200 text-sm font-medium">↳ {child.label}</span>
                          {!child.activo && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold uppercase">Inactivo</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 pl-4">
                          Enlace: <code className="bg-white/5 px-1 py-0.5 rounded">{child.href || '-'}</code> • Orden: {child.orden}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditId(child.id)} className="btn-secondary text-xs py-1 px-2.5">✏️</button>
                        <button
                          onClick={() => handleDelete(child.id)}
                          className="btn-secondary text-xs py-1 px-2.5 text-red-400 border-red-500/20 hover:bg-red-500/10"
                          disabled={loading === child.id + '-del'}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}

        {roots.length === 0 && !adding && (
          <div className="card-glass p-6 text-center text-slate-500 text-sm">
            No tienes enlaces de menú personalizados. La landing usará el menú por defecto.
          </div>
        )}
      </div>

      {/* Formulario Agregar Elemento */}
      {adding ? (
        <form onSubmit={handleAdd} className="card-glass p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Nuevo Elemento de Menú</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Etiqueta *</label>
              <input name="label" required placeholder="ej. Contacto" className="input-base text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Enlace / Ancla</label>
              <input name="href" placeholder="ej. #galeria o /login" className="input-base text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Anidar bajo (Dropdown)</label>
              <select name="parent_id" className="input-base text-sm" defaultValue="">
                <option value="">Ninguno (Enlace Principal)</option>
                {parentOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Orden</label>
              <input name="orden" type="number" placeholder="0" className="input-base text-sm" />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            💡 Para crear un **dropdown desplegable**, añade un elemento sin enlace (déjalo vacío) y luego añade sub-elementos anidados bajo él.
          </p>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">Cancelar</button>
            <button type="submit" className="btn-primary text-sm" disabled={loading === 'add'}>
              {loading === 'add' ? 'Guardando...' : 'Agregar Elemento'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="btn-secondary w-full justify-center text-sm"
        >
          + Agregar Enlace de Menú
        </button>
      )}
    </div>
  )
}
