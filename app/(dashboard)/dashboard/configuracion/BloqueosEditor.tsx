'use client'

import { useState } from 'react'
import { crearBloqueoAction, eliminarBloqueoAction } from './actions'
import type { BloqueoHorario } from '@/lib/definitions'

interface Props {
  bloqueos: BloqueoHorario[]
}

export default function BloqueosEditor({ bloqueos }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const [tipoBloqueo, setTipoBloqueo] = useState<'dia' | 'franja'>('dia')

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await crearBloqueoAction(formData)

    if (result.error) {
      setError(result.error)
    } else {
      (e.target as HTMLFormElement).reset()
    }
    setIsPending(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este bloqueo?')) return
    await eliminarBloqueoAction(id)
  }

  const hoy = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Formulario para crear bloqueo */}
      <form onSubmit={handleCreate} className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-sm font-semibold text-white">Agregar bloqueo</h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTipoBloqueo('dia')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tipoBloqueo === 'dia'
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            Día completo
          </button>
          <button
            type="button"
            onClick={() => setTipoBloqueo('franja')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tipoBloqueo === 'franja'
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10'
            }`}
          >
            Franja horaria
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Fecha *</label>
            <input type="date" name="fecha" required min={hoy} className="input-base" />
          </div>

          {tipoBloqueo === 'franja' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Desde</label>
                <input type="time" name="hora_inicio" required className="input-base" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Hasta</label>
                <input type="time" name="hora_fin" required className="input-base" />
              </div>
            </>
          )}

          {tipoBloqueo === 'dia' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Motivo (opcional)</label>
              <input type="text" name="motivo" placeholder="Ej: Viaje, feriado..." className="input-base" />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? 'Agregando...' : 'Agregar bloqueo'}
          </button>
        </div>
      </form>

      {/* Lista de bloqueos existentes */}
      <div className="space-y-2">
        {bloqueos.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No hay bloqueos registrados.</p>
        ) : (
          bloqueos.map((b) => {
            const fecha = new Date(b.fecha + 'T12:00:00')
            const esDiaCompleto = !b.hora_inicio && !b.hora_fin
            return (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-red-500/10 text-red-400 flex-shrink-0">
                    <span className="text-[10px] font-semibold uppercase leading-none">
                      {fecha.toLocaleString('es', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold leading-none">{fecha.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {esDiaCompleto ? 'Todo el día' : `${b.hora_inicio?.slice(0, 5)} - ${b.hora_fin?.slice(0, 5)}`}
                    </p>
                    {b.motivo && (
                      <p className="text-xs text-slate-400 truncate">{b.motivo}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                  title="Eliminar bloqueo"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}