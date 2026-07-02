'use client'

import { useState } from 'react'
import { createCursoAction } from './actions'

export default function NuevoCursoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <>
      {/* Botón disparador */}
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nuevo Curso
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-surface-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Crear Nuevo Curso / Servicio</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Contenido / Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="nombre" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nombre del Servicio *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  placeholder="ej. Curso Automaquillaje Social"
                  className="input-base"
                />
              </div>

              <div>
                <label htmlFor="descripcion" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows={3}
                  placeholder="ej. Duración, qué incluye, productos incluidos..."
                  className="input-base"
                  style={{ resize: 'none' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="precio" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Precio ($) *
                  </label>
                  <input
                    id="precio"
                    name="precio"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="ej. 15000"
                    className="input-base"
                  />
                </div>

                <div>
                  <label htmlFor="duracion" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Duración (Horas)
                  </label>
                  <input
                    id="duracion"
                    name="duracion"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="ej. 2.5"
                    className="input-base"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary"
                  disabled={isPending}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isPending}
                >
                  {isPending ? 'Guardando...' : 'Crear Servicio'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  )
}
