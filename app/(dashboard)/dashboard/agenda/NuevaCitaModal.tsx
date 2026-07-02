'use client'

import { useState } from 'react'
import { createCitaAction } from './actions'
import type { Cliente, Curso } from '@/lib/definitions'

interface NuevaCitaModalProps {
  clientes: Cliente[]
  cursos: Curso[]
}

export default function NuevaCitaModal({ clientes, cursos }: NuevaCitaModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createCitaAction(formData)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setIsOpen(false)
      setIsPending(false)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  // Obtener fecha actual en formato YYYY-MM-DD para el default
  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Nueva Cita
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-surface-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Agendar Nueva Cita</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors" type="button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Selección de Cliente */}
              <div>
                <label htmlFor="cliente_id" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Seleccionar Cliente *
                </label>
                {clientes.length === 0 ? (
                  <p className="text-xs text-amber-400">
                    ⚠️ Primero debes registrar al menos un cliente en la sección Clientes.
                  </p>
                ) : (
                  <select
                    id="cliente_id"
                    name="cliente_id"
                    required
                    className="input-base text-slate-200"
                  >
                    <option value="" className="bg-surface-800">-- Selecciona un cliente --</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id} className="bg-surface-800">
                        {c.nombre} {c.telefono ? `(${c.telefono})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selección de Curso/Servicio */}
              <div>
                <label htmlFor="curso_id" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Servicio / Curso
                </label>
                <select
                  id="curso_id"
                  name="curso_id"
                  className="input-base text-slate-200"
                >
                  <option value="" className="bg-surface-800">-- Sin servicio específico (Personalizado) --</option>
                  {cursos.map((cr) => (
                    <option key={cr.id} value={cr.id} className="bg-surface-800">
                      {cr.nombre} (${cr.precio})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fecha" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Fecha *
                  </label>
                  <input
                    id="fecha"
                    name="fecha"
                    type="date"
                    required
                    min={today}
                    defaultValue={today}
                    className="input-base text-slate-200"
                  />
                </div>

                <div>
                  <label htmlFor="hora" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Hora *
                  </label>
                  <input
                    id="hora"
                    name="hora"
                    type="time"
                    required
                    className="input-base text-slate-200"
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label htmlFor="notas" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Notas adicionales
                </label>
                <textarea
                  id="notas"
                  name="notas"
                  rows={2}
                  placeholder="ej. Trae sus propios pinceles, se maquilla para boda..."
                  className="input-base"
                  style={{ resize: 'none' }}
                />
              </div>

              {/* Botones */}
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
                  disabled={isPending || clientes.length === 0}
                >
                  {isPending ? 'Agendando...' : 'Agendar Cita'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  )
}
