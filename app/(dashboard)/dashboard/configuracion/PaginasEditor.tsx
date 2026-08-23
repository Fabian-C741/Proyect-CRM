'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPaginaAction, updatePaginaAction, deletePaginaAction } from './actions'
import type { Pagina } from '@/lib/definitions'

export default function PaginasEditor({ paginas }: { paginas: Pagina[] }) {
  const router = useRouter()
  const [creando, setCreando] = useState(false)
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevoContenido, setNuevoContenido] = useState('')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editContenido, setEditContenido] = useState('')
  const [pendiente, setPendiente] = useState(false)
  const [message, setMessage] = useState('')

  const crear = async () => {
    if (!nuevoTitulo.trim()) {
      setMessage('Poné un título para la página.')
      return
    }
    setPendiente(true)
    const fd = new FormData()
    fd.set('titulo', nuevoTitulo)
    fd.set('contenido', nuevoContenido)
    const result = await createPaginaAction(fd)
    setPendiente(false)
    if (result.error) {
      setMessage(result.error)
      return
    }
    setMessage(`✅ Página creada y enlazada en el menú: /p/${result.slug}`)
    setNuevoTitulo('')
    setNuevoContenido('')
    setCreando(false)
    router.refresh()
  }

  const empezarEdicion = (p: Pagina) => {
    setEditandoId(p.id)
    setEditTitulo(p.titulo)
    setEditContenido(p.contenido || '')
    setMessage('')
  }

  const guardarEdicion = async (p: Pagina) => {
    setPendiente(true)
    const fd = new FormData()
    fd.set('titulo', editTitulo)
    fd.set('contenido', editContenido)
    fd.set('activo', String(p.activo))
    const result = await updatePaginaAction(p.id, fd)
    setPendiente(false)
    if (result.error) {
      setMessage(result.error)
      return
    }
    setMessage('✅ Página actualizada.')
    setEditandoId(null)
    router.refresh()
  }

  const alternarActiva = async (p: Pagina) => {
    setPendiente(true)
    const fd = new FormData()
    fd.set('titulo', p.titulo)
    fd.set('contenido', p.contenido || '')
    fd.set('activo', String(!p.activo))
    const result = await updatePaginaAction(p.id, fd)
    setPendiente(false)
    if (result.error) {
      setMessage(result.error)
      return
    }
    router.refresh()
  }

  const eliminar = async (p: Pagina) => {
    if (!confirm(`¿Eliminar la página "${p.titulo}"? También se quita su enlace del menú.`)) return
    setPendiente(true)
    const result = await deletePaginaAction(p.id)
    setPendiente(false)
    if (result.error) {
      setMessage(result.error)
      return
    }
    setMessage('✅ Página eliminada.')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">
        Creá páginas propias (ej: Promociones, Consejos, Términos). Se publican en{' '}
        <code className="bg-white/5 px-1 rounded">/p/nombre</code> y se agregan solas al menú superior.
        Después podés ordenarlas o agruparlas en la pestaña ⚓ Menú Superior.
      </p>

      {message && (
        <div style={{ padding: '1rem', borderRadius: 8, background: message.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.startsWith('✅') ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {/* Crear nueva */}
      {!creando ? (
        <button type="button" onClick={() => { setCreando(true); setMessage('') }} className="btn-secondary text-sm">
          ➕ Crear página nueva
        </button>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-pink-500/30 bg-pink-500/[0.04] space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Título *</label>
            <input
              type="text"
              value={nuevoTitulo}
              onChange={e => setNuevoTitulo(e.target.value)}
              placeholder="ej. Promociones de Septiembre"
              maxLength={80}
              className="input-base text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contenido</label>
            <textarea
              value={nuevoContenido}
              onChange={e => setNuevoContenido(e.target.value)}
              placeholder="Escribí acá el texto de la página..."
              rows={6}
              className="input-base text-sm"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setCreando(false)} className="btn-secondary text-xs" disabled={pendiente}>Cancelar</button>
            <button type="button" onClick={crear} className="btn-primary text-xs" disabled={pendiente}>
              {pendiente ? 'Creando...' : 'Crear página'}
            </button>
          </div>
        </div>
      )}

      {/* Listado */}
      {paginas.length === 0 && !creando && (
        <p className="text-slate-500 text-sm">Todavía no creaste ninguna página.</p>
      )}

      <div className="space-y-3">
        {paginas.map(p => (
          <div key={p.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]" style={{ opacity: p.activo ? 1 : 0.55 }}>
            {editandoId === p.id ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Título</label>
                  <input type="text" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} maxLength={80} className="input-base text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contenido</label>
                  <textarea value={editContenido} onChange={e => setEditContenido(e.target.value)} rows={6} className="input-base text-sm" />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setEditandoId(null)} className="btn-secondary text-xs" disabled={pendiente}>Cancelar</button>
                  <button type="button" onClick={() => guardarEdicion(p)} className="btn-primary text-xs" disabled={pendiente}>
                    {pendiente ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <span className="font-semibold text-white text-sm">{p.titulo}</span>
                    <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer" className="block text-xs text-pink-400 hover:text-pink-300 mt-0.5">
                      /p/{p.slug} ↗
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => alternarActiva(p)} disabled={pendiente} className="text-xs text-slate-300 hover:text-white border border-white/10 rounded-lg px-2 py-1">
                      {p.activo ? '👁️ Visible' : '🚫 Oculta'}
                    </button>
                    <button type="button" onClick={() => empezarEdicion(p)} className="text-xs text-slate-300 hover:text-white border border-white/10 rounded-lg px-2 py-1">
                      ✏️ Editar
                    </button>
                    <button type="button" onClick={() => eliminar(p)} disabled={pendiente} className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg px-2 py-1">
                      🗑️
                    </button>
                  </div>
                </div>
                {p.contenido && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.contenido}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Nota: la primera vez hay que ejecutar <code className="bg-white/5 px-1 rounded">supabase_migration_paginas.sql</code> en Supabase.
      </p>
    </div>
  )
}
