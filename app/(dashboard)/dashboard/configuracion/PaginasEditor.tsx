'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { createPaginaAction, updatePaginaAction, deletePaginaAction } from './actions'
import type { Pagina, PaginaBloque } from '@/lib/definitions'

// Extrae el ID de un enlace de YouTube (watch / youtu.be / shorts / embed / live)
const YOUTUBE_ID_RE = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i

function idYouTube(url: string): string | null {
  const m = url.trim().match(YOUTUBE_ID_RE)
  return m ? m[1] : null
}

// ─────────────────────────────────────────────
// Subida de imagen para un bloque
// ─────────────────────────────────────────────
function ImagenBloqueUploader({
  bloque,
  onChange,
}: {
  bloque: Extract<PaginaBloque, { tipo: 'imagen' }>
  onChange: (patch: Partial<Extract<PaginaBloque, { tipo: 'imagen' }>>) => void
}) {
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subir = async (file: File | undefined) => {
    if (!file) return
    setSubiendo(true)
    setError(null)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `paginas/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const supabase = createSupabaseBrowserClient()
    const { error: upErr } = await supabase.storage
      .from('servicios')
      .upload(fileName, file, { contentType: file.type, upsert: false })
    if (upErr) {
      setError('Error al subir: ' + upErr.message)
      setSubiendo(false)
      return
    }
    const { data } = supabase.storage.from('servicios').getPublicUrl(fileName)
    onChange({ url: data.publicUrl })
    setSubiendo(false)
  }

  return (
    <div className="space-y-2 w-full">
      <input
        type="file"
        accept="image/*"
        onChange={e => subir(e.target.files?.[0])}
        disabled={subiendo}
        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20 disabled:opacity-50"
      />
      <input
        type="text"
        placeholder="Descripción de la imagen (opcional)"
        value={bloque.descripcion || ''}
        onChange={e => onChange({ descripcion: e.target.value })}
        maxLength={300}
        className="input-base text-xs"
      />
      {bloque.url && (
        <div className="rounded-lg overflow-hidden bg-slate-800" style={{ width: '100%', height: 160 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bloque.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      {subiendo && <span className="text-xs text-pink-400">Subiendo imagen...</span>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────
// Editor de bloque de video (YouTube por enlace)
// ─────────────────────────────────────────────
function VideoBloqueInput({
  bloque,
  onChange,
}: {
  bloque: Extract<PaginaBloque, { tipo: 'video' }>
  onChange: (patch: Partial<Extract<PaginaBloque, { tipo: 'video' }>>) => void
}) {
  const id = bloque.url ? idYouTube(bloque.url) : null
  const invalida = Boolean(bloque.url) && !id

  return (
    <div className="space-y-2 w-full">
      <input
        type="text"
        placeholder="Pegá el enlace del video (ej. https://www.youtube.com/watch?v=...)"
        value={bloque.url}
        onChange={e => onChange({ url: e.target.value })}
        maxLength={1000}
        className="input-base text-xs"
      />
      <input
        type="text"
        placeholder="Descripción del video (opcional)"
        value={bloque.descripcion || ''}
        onChange={e => onChange({ descripcion: e.target.value })}
        maxLength={300}
        className="input-base text-xs"
      />
      {invalida && (
        <p className="text-xs text-red-400">
          El enlace no parece ser de YouTube. Ej.: https://www.youtube.com/watch?v=dQw4w9WgXcQ
        </p>
      )}
      {id && (
        <div className="rounded-lg overflow-hidden bg-slate-800" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="Preview del video"
            allowFullScreen
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Editor de bloques (lista ordenable)
// ─────────────────────────────────────────────
function BloquesEditor({
  bloques,
  setBloques,
}: {
  bloques: PaginaBloque[]
  setBloques: (b: PaginaBloque[]) => void
}) {
  const actualizar = (i: number, patch: Partial<PaginaBloque>) => {
    const nuevos = [...bloques]
    nuevos[i] = { ...nuevos[i], ...patch } as PaginaBloque
    setBloques(nuevos)
  }

  const mover = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= bloques.length) return
    const nuevos = [...bloques]
    ;[nuevos[i], nuevos[j]] = [nuevos[j], nuevos[i]]
    setBloques(nuevos)
  }

  const agregar = (tipo: PaginaBloque['tipo']) => {
    if (tipo === 'imagen') {
      setBloques([...bloques, { tipo: 'imagen', url: '', descripcion: '' }])
    } else if (tipo === 'video') {
      setBloques([...bloques, { tipo: 'video', url: '', descripcion: '' }])
    } else {
      setBloques([...bloques, { tipo, texto: '' }])
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Contenido ({bloques.length} {bloques.length === 1 ? 'bloque' : 'bloques'})
      </label>

      {bloques.map((b, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/10 bg-white/[0.03] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-pink-400 font-semibold">
              {b.tipo === 'titulo' ? '🏷️ Título' : b.tipo === 'texto' ? '📝 Texto' : b.tipo === 'imagen' ? '🖼️ Imagen' : '🎬 Video'}
            </span>
            <div className="flex gap-1 items-center">
              <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} title="Subir" className="px-1.5 text-slate-400 hover:text-white disabled:opacity-30">▲</button>
              <button type="button" onClick={() => mover(i, 1)} disabled={i === bloques.length - 1} title="Bajar" className="px-1.5 text-slate-400 hover:text-white disabled:opacity-30">▼</button>
              <button type="button" onClick={() => setBloques(bloques.filter((_, j) => j !== i))} className="ml-1 text-xs text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg px-2 py-0.5">
                🗑️ Eliminar
              </button>
            </div>
          </div>

          {(b.tipo === 'titulo' || b.tipo === 'texto') && (
            b.tipo === 'titulo' ? (
              <input
                type="text"
                placeholder="Texto del título"
                value={b.texto}
                onChange={e => actualizar(i, { texto: e.target.value })}
                maxLength={200}
                className="input-base text-sm font-semibold"
              />
            ) : (
              <textarea
                placeholder="Escribí acá..."
                value={b.texto}
                onChange={e => actualizar(i, { texto: e.target.value })}
                rows={4}
                className="input-base text-sm"
              />
            )
          )}

          {b.tipo === 'imagen' && (
            <ImagenBloqueUploader
              bloque={b}
              onChange={patch => actualizar(i, patch)}
            />
          )}

          {b.tipo === 'video' && (
            <VideoBloqueInput
              bloque={b}
              onChange={patch => actualizar(i, patch)}
            />
          )}
        </div>
      ))}

      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={() => agregar('titulo')} className="btn-secondary text-xs">🏷️ Título</button>
        <button type="button" onClick={() => agregar('texto')} className="btn-secondary text-xs">📝 Texto</button>
        <button type="button" onClick={() => agregar('imagen')} className="btn-secondary text-xs">🖼️ Imagen</button>
        <button type="button" onClick={() => agregar('video')} className="btn-secondary text-xs">🎬 Video</button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Editor principal de páginas
// ─────────────────────────────────────────────
export default function PaginasEditor({ paginas }: { paginas: Pagina[] }) {
  const router = useRouter()
  const [creando, setCreando] = useState(false)
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevosBloques, setNuevosBloques] = useState<PaginaBloque[]>([])
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editBloques, setEditBloques] = useState<PaginaBloque[]>([])
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
    fd.set('contenido', '')
    fd.set('bloques', JSON.stringify(nuevosBloques))
    const result = await createPaginaAction(fd)
    setPendiente(false)
    if (result.error) {
      setMessage(result.error)
      return
    }
    setMessage(`✅ Página creada y enlazada en el menú: /p/${result.slug}`)
    setNuevoTitulo('')
    setNuevosBloques([])
    setCreando(false)
    router.refresh()
  }

  const empezarEdicion = (p: Pagina) => {
    setEditandoId(p.id)
    setEditTitulo(p.titulo)
    setEditBloques(Array.isArray(p.bloques) ? p.bloques : [])
    setMessage('')
  }

  const guardarEdicion = async (p: Pagina) => {
    setPendiente(true)
    const fd = new FormData()
    fd.set('titulo', editTitulo)
    fd.set('contenido', p.contenido || '')
    fd.set('activo', String(p.activo))
    fd.set('bloques', JSON.stringify(editBloques))
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
        Creá páginas propias con títulos, textos, imágenes y videos de YouTube. Se publican en{' '}
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
        <div className="p-4 rounded-xl border border-dashed border-pink-500/30 bg-pink-500/[0.04] space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Título de la página *</label>
            <input
              type="text"
              value={nuevoTitulo}
              onChange={e => setNuevoTitulo(e.target.value)}
              placeholder="ej. Promociones de Septiembre"
              maxLength={80}
              className="input-base text-sm"
            />
          </div>
          <BloquesEditor bloques={nuevosBloques} setBloques={setNuevosBloques} />
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
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Título</label>
                  <input type="text" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} maxLength={80} className="input-base text-sm" />
                </div>
                <BloquesEditor bloques={editBloques} setBloques={setEditBloques} />
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
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {Array.isArray(p.bloques) && p.bloques.length > 0
                    ? `${p.bloques.length} ${p.bloques.length === 1 ? 'bloque' : 'bloques'} de contenido`
                    : 'Sin contenido todavía — tocá ✏️ Editar para agregar'}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Nota: la primera vez hay que ejecutar <code className="bg-white/5 px-1 rounded">supabase_migration_paginas.sql</code> y{' '}
        <code className="bg-white/5 px-1 rounded">supabase_migration_paginas_bloques.sql</code> en Supabase.
      </p>
    </div>
  )
}
