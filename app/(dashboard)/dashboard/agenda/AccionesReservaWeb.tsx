'use client'

import { useState, useTransition } from 'react'
import { updateEstadoReservaWebAction } from './actions'

interface Props {
  reservaId: string
  estadoActual: 'pendiente' | 'confirmado' | 'cancelado'
  nombreVisitante: string
  telefonoVisitante: string
  servicioNombre: string
  fechaPreferida: string
  horaPreferida: string | null
  whatsappNumber: string
}

export default function AccionesReservaWeb({
  reservaId,
  estadoActual,
  nombreVisitante,
  telefonoVisitante,
  servicioNombre,
  fechaPreferida,
  horaPreferida,
  whatsappNumber,
}: Props) {
  const [estado, setEstado] = useState(estadoActual)
  const [isPending, startTransition] = useTransition()

  const handleEstado = (nuevoEstado: 'confirmado' | 'cancelado') => {
    startTransition(async () => {
      const result = await updateEstadoReservaWebAction(reservaId, nuevoEstado)
      if (!result?.error) setEstado(nuevoEstado)
    })
  }

  const abrirWhatsApp = () => {
    const fecha = new Date(fechaPreferida + 'T12:00:00').toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long',
    })
    const hora = horaPreferida ? ` a las ${horaPreferida}` : ''
    const msg = estado === 'confirmado'
      ? `Hola ${nombreVisitante}! 💅✨ Te confirmamos tu turno para *${servicioNombre}* el *${fecha}${hora}*. ¡Te esperamos!`
      : `Hola ${nombreVisitante}! Te contactamos por tu reserva de *${servicioNombre}* para el *${fecha}${hora}*.`
    const tel = telefonoVisitante.replace(/\D/g, '')
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const badgeStyle: Record<string, { bg: string; color: string; label: string }> = {
    pendiente:  { bg: 'rgba(234,179,8,0.15)',  color: '#facc15', label: 'Pendiente' },
    confirmado: { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', label: 'Confirmado' },
    cancelado:  { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', label: 'Cancelado' },
  }

  const badge = badgeStyle[estado]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {/* Badge de estado */}
      <span style={{
        padding: '0.2rem 0.65rem', borderRadius: 9999,
        background: badge.bg, color: badge.color,
        fontSize: '0.75rem', fontWeight: 600,
      }}>
        {badge.label}
      </span>

      {/* Botón Confirmar — solo si no está confirmado o cancelado */}
      {estado === 'pendiente' && (
        <button
          onClick={() => handleEstado('confirmado')}
          disabled={isPending}
          title="Confirmar reserva"
          style={{
            padding: '0.3rem 0.75rem', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(34,197,94,0.15)', color: '#4ade80',
            fontSize: '0.75rem', fontWeight: 600,
            opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s',
          }}
        >
          ✓ Confirmar
        </button>
      )}

      {/* Botón Cancelar — solo si no está cancelado */}
      {estado !== 'cancelado' && (
        <button
          onClick={() => handleEstado('cancelado')}
          disabled={isPending}
          title="Cancelar reserva"
          style={{
            padding: '0.3rem 0.75rem', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'rgba(239,68,68,0.12)', color: '#f87171',
            fontSize: '0.75rem', fontWeight: 600,
            opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s',
          }}
        >
          ✕ Cancelar
        </button>
      )}

      {/* Botón WhatsApp — siempre visible */}
      <button
        onClick={abrirWhatsApp}
        title="Contactar por WhatsApp"
        style={{
          padding: '0.3rem 0.75rem', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: 'rgba(37,211,102,0.15)', color: '#25d366',
          fontSize: '0.75rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '0.3rem',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM16.49 14.5C16.24 14.38 15.03 13.78 14.81 13.7C14.59 13.62 14.42 13.58 14.26 13.82C14.1 14.07 13.64 14.61 13.5 14.77C13.36 14.94 13.21 14.96 12.97 14.83C12.72 14.71 11.93 14.45 10.99 13.61C10.26 12.95 9.77 12.14 9.63 11.89C9.48 11.64 9.61 11.51 9.74 11.38C9.85 11.27 9.98 11.1 10.1 10.95C10.22 10.81 10.26 10.7 10.34 10.54C10.42 10.37 10.38 10.23 10.32 10.1C10.26 9.98 9.77 8.78 9.57 8.28C9.37 7.8 9.17 7.86 9.02 7.85C8.88 7.85 8.71 7.85 8.55 7.85C8.39 7.85 8.12 7.91 7.9 8.16C7.67 8.4 7.04 8.98 7.04 10.16C7.04 11.34 7.94 12.48 8.06 12.65C8.18 12.82 9.77 15.35 12.28 16.41C12.88 16.66 13.35 16.81 13.71 16.92C14.31 17.11 14.86 17.08 15.29 17.01C15.78 16.93 16.8 16.39 17.01 15.79C17.22 15.19 17.22 14.67 17.16 14.56C17.09 14.44 16.93 14.38 16.68 14.25" />
        </svg>
        WhatsApp
      </button>
    </div>
  )
}
