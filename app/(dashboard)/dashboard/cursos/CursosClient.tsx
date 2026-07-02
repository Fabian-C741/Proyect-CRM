'use client'

import { useState } from 'react'
import type { Curso } from '@/lib/definitions'
import EditarCursoModal from './EditarCursoModal'
import { deleteCursoAction } from './actions'

const TIPO_LABELS: Record<string, { icon: string; label: string; color: string }> = {
  servicio: { icon: '💆', label: 'Servicio', color: 'rgba(236,72,153,0.15)' },
  curso:    { icon: '🎓', label: 'Curso', color: 'rgba(168,85,247,0.15)' },
  pdf:      { icon: '📄', label: 'PDF', color: 'rgba(59,130,246,0.15)' },
  ebook:    { icon: '📚', label: 'eBook', color: 'rgba(34,197,94,0.15)' },
}

const MODO_LABELS: Record<string, string> = {
  whatsapp:    '💬 WhatsApp',
  link_externo: '🔗 Link externo',
  mensaje:     '✉️ Mensaje',
}

export default function CursosClient({ cursos: initial }: { cursos: Curso[] }) {
  const [cursos, setCursos] = useState(initial)
  const [editCurso, setEditCurso] = useState<Curso | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto? Desaparecerá de tu landing.')) return
    setDeleting(id)
    const result = await deleteCursoAction(id)
    if (result.success) {
      setCursos(prev => prev.filter(c => c.id !== id))
    }
    setDeleting(null)
  }

  if (cursos.length === 0) {
    return (
      <div className="card-glass p-12 text-center">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
        <p className="text-white font-semibold text-lg mb-2">Aún no tenés productos</p>
        <p className="text-slate-400 text-sm">Creá tu primer servicio, curso, PDF o eBook con el botón &quot;Nuevo Producto&quot;.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.map((curso) => {
          const tipoInfo = TIPO_LABELS[curso.tipo || 'servicio'] || TIPO_LABELS.servicio
          return (
            <div key={curso.id} className="card-glass card-hover flex flex-col overflow-hidden">
              {/* Imagen */}
              {curso.imagen_url ? (
                <div style={{ height: 160, background: `url(${curso.imagen_url}) center/cover`, flexShrink: 0 }} />
              ) : (
                <div
                  style={{
                    height: 100,
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(168,85,247,0.12) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    flexShrink: 0,
                  }}
                >
                  {tipoInfo.icon}
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Badges */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                      padding: '0.2rem 0.6rem', borderRadius: 9999,
                      background: tipoInfo.color,
                      color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600,
                    }}
                  >
                    {tipoInfo.icon} {tipoInfo.label}
                  </span>
                  {curso.mostrar_en_landing && (
                    <span className="badge badge-green">Visible en landing</span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-tight">{curso.nombre}</h3>
                {curso.descripcion && (
                  <p className="text-sm text-slate-400 mb-3 flex-grow line-clamp-2">{curso.descripcion}</p>
                )}

                <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/5">
                  <div>
                    <span className="font-bold text-pink-400 text-lg">${curso.precio}</span>
                    {curso.duracion_horas && (
                      <span className="text-xs text-slate-500 ml-2 bg-white/5 px-2 py-0.5 rounded">
                        {curso.duracion_horas}h
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{MODO_LABELS[curso.modo_venta || 'whatsapp']}</span>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditCurso(curso)}
                    className="btn-secondary flex-1 justify-center text-xs py-1.5"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(curso.id)}
                    disabled={deleting === curso.id}
                    className="btn-secondary text-xs py-1.5 px-3 text-red-400 border-red-500/20 hover:bg-red-500/10"
                  >
                    {deleting === curso.id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editCurso && (
        <EditarCursoModal
          curso={editCurso}
          onClose={() => setEditCurso(null)}
        />
      )}
    </>
  )
}
