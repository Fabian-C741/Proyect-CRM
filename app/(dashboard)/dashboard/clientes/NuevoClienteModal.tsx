'use client'

import { useState } from 'react'
import { createClienteAction } from './actions'

export default function NuevoClienteModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createClienteAction(formData)

    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setIsOpen(false)
      setIsPending(false)
      // Resetear formulario
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
        Nuevo Cliente
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-surface-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Header del Modal */}
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Registrar Nuevo Cliente</h2>
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
                  Nombre Completo *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  placeholder="ej. María Pérez"
                  className="input-base"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ej. maria@gmail.com"
                  className="input-base"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Teléfono / WhatsApp
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="ej. +54 9 11 1234 5678"
                  className="input-base"
                />
              </div>

              <div>
                <label htmlFor="notas" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Notas / Observaciones
                </label>
                <textarea
                  id="notas"
                  name="notas"
                  rows={3}
                  placeholder="Detalles sobre tipo de piel, preferencias de maquillaje, etc..."
                  className="input-base"
                  style={{ resize: 'none' }}
                />
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
                  {isPending ? 'Guardando...' : 'Guardar Cliente'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  )
}
