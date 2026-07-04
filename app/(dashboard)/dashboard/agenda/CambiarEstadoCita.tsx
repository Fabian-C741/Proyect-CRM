'use client'

import { useState, useTransition } from 'react'
import { updateEstadoCitaAction } from './actions'

type EstadoCita = 'pendiente' | 'confirmado' | 'cancelado' | 'completado'

interface CambiarEstadoCitaProps {
  citaId: string
  estadoActual: EstadoCita
}

const OPCIONES: { value: EstadoCita; label: string; className: string }[] = [
  { value: 'pendiente', label: 'Pendiente', className: 'badge-yellow' },
  { value: 'confirmado', label: 'Confirmado', className: 'badge-green' },
  { value: 'completado', label: 'Completado', className: 'badge-blue' },
  { value: 'cancelado', label: 'Cancelado', className: 'badge-gray' },
]

export default function CambiarEstadoCita({ citaId, estadoActual }: CambiarEstadoCitaProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [estado, setEstado] = useState<EstadoCita>(estadoActual)

  const opcion = OPCIONES.find((o) => o.value === estado) ?? OPCIONES[0]

  const handleSelect = (nuevoEstado: EstadoCita) => {
    if (nuevoEstado === estado) {
      setOpen(false)
      return
    }
    startTransition(async () => {
      const result = await updateEstadoCitaAction(citaId, nuevoEstado)
      if (!result?.error) {
        setEstado(nuevoEstado)
      }
      setOpen(false)
    })
  }

  return (
    <div className="relative" id={`estado-cita-${citaId}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className={`badge ${opcion.className} cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {isPending ? '...' : opcion.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1 inline-block"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          {/* Overlay para cerrar al clickar fuera */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 mt-1 w-36 bg-surface-800 border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden animate-fade-in">
            {OPCIONES.map((op) => (
              <button
                key={op.value}
                type="button"
                onClick={() => handleSelect(op.value)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  op.value === estado
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
