'use client'

import { useState } from 'react'
import { crearReservaWebAction } from '@/app/(dashboard)/dashboard/ajustes/actions'
import type { Servicio } from '@/lib/definitions'

const FALLBACK_SERVICIOS: Pick<Servicio, 'id' | 'nombre' | 'descripcion' | 'precio' | 'duracion_minutos'>[] = [
  { id: 'f1', nombre: 'Maquillaje Social', descripcion: 'Look perfecto para eventos y fiestas', precio: 0, duracion_minutos: 60 },
  { id: 'f2', nombre: 'Maquillaje de Novia', descripcion: 'Para el día más especial con productos premium', precio: 0, duracion_minutos: 90 },
  { id: 'f3', nombre: 'Automaquillaje', descripcion: 'Aprendé técnicas para tu día a día', precio: 0, duracion_minutos: 120 },
]

interface Props {
  servicios: Servicio[]
}

type Paso = 'elegir' | 'formulario' | 'exito'

export default function ReservaSection({ servicios }: Props) {
  const lista = servicios.length > 0 ? servicios : FALLBACK_SERVICIOS as Servicio[]

  const [paso, setPaso] = useState<Paso>('elegir')
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Campos del formulario
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [notas, setNotas] = useState('')

  const seleccionar = (s: Servicio) => {
    setServicioSeleccionado(s)
    setPaso('formulario')
    setErrorMsg('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !telefono.trim() || !fecha) {
      setErrorMsg('Por favor completá nombre, teléfono y fecha.')
      return
    }
    setLoading(true)
    setErrorMsg('')

    const result = await crearReservaWebAction({
      nombre_visitante: nombre.trim(),
      telefono_visitante: telefono.trim(),
      servicio_id: servicioSeleccionado?.id && !servicioSeleccionado.id.startsWith('f') ? servicioSeleccionado.id : null,
      servicio_nombre: servicioSeleccionado?.nombre ?? 'Sin especificar',
      servicio_precio: servicioSeleccionado?.precio ?? null,
      fecha_preferida: fecha,
      hora_preferida: hora || null,
      notas: notas.trim() || null,
    })

    setLoading(false)
    if (result.success) {
      setPaso('exito')
    } else {
      setErrorMsg(result.error || 'Ocurrió un error. Intentá de nuevo.')
    }
  }

  const reiniciar = () => {
    setPaso('elegir')
    setServicioSeleccionado(null)
    setNombre('')
    setTelefono('')
    setFecha('')
    setHora('')
    setNotas('')
    setErrorMsg('')
  }

  // Fecha mínima = mañana
  const hoy = new Date()
  hoy.setDate(hoy.getDate() + 1)
  const fechaMin = hoy.toISOString().split('T')[0]

  return (
    <section id="reservar" style={{ width: '100%', maxWidth: 900, margin: '0 auto 6rem' }}>
      {/* Encabezado */}
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>
        Reservá tu turno
      </h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>
        Elegí el servicio que querés y completá tus datos — ¡es muy rápido!
      </p>

      {/* ─── PASO: Elegir servicio ─── */}
      {paso === 'elegir' && (
        <div className="card-glass" style={{ maxWidth: 480, margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Seleccioná un servicio
              </label>
              <select
                className="input-base"
                onChange={e => {
                  const s = lista.find(s => s.id === e.target.value)
                  if (s) seleccionar(s)
                }}
                defaultValue=""
              >
                <option value="" disabled>— Elegí un servicio —</option>
                {lista.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}{s.precio > 0 ? ` — $${s.precio.toLocaleString('es-AR')}` : ''}
                  </option>
                ))}
              </select>
            </div>
            {lista.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center' }}>
                No hay servicios disponibles por el momento.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ─── PASO: Formulario ─── */}
      {paso === 'formulario' && (
        <div className="card-glass" style={{ maxWidth: 560, margin: '0 auto', padding: '2rem' }}>
          {/* Servicio seleccionado */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.75rem 1rem', borderRadius: 12,
            background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)',
            marginBottom: '1.5rem',
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#f472b6', fontWeight: 600, marginBottom: '0.15rem' }}>
                SERVICIO ELEGIDO
              </p>
              <p style={{ fontWeight: 700, color: 'white' }}>{servicioSeleccionado?.nombre}</p>
            </div>
            {servicioSeleccionado && servicioSeleccionado.precio > 0 && (
              <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f472b6' }}>
                ${servicioSeleccionado.precio.toLocaleString('es-AR')}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nombre completo *
              </label>
              <input
                type="text" className="input-base" placeholder="Tu nombre"
                value={nombre} onChange={e => setNombre(e.target.value)} required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Teléfono / WhatsApp *
              </label>
              <input
                type="tel" className="input-base" placeholder="Ej: 011 1234-5678"
                value={telefono} onChange={e => setTelefono(e.target.value)} required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Fecha preferida *
                </label>
                <input
                  type="date" className="input-base"
                  min={fechaMin}
                  value={fecha} onChange={e => setFecha(e.target.value)} required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Hora preferida
                </label>
                <input
                  type="time" className="input-base"
                  value={hora} onChange={e => setHora(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nota adicional
              </label>
              <textarea
                className="input-base" rows={2}
                placeholder="Algo que quieras avisarnos..."
                value={notas} onChange={e => setNotas(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '0.875rem' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={reiniciar}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                ← Volver
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? 'Enviando...' : '✨ Confirmar reserva'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── PASO: Éxito ─── */}
      {paso === 'exito' && (
        <div className="card-glass" style={{
          maxWidth: 480, margin: '0 auto', padding: '3rem 2rem', textAlign: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(34,197,94,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 1.5rem',
          }}>
            ✅
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'white' }}>
            ¡Reserva enviada!
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Recibimos tu solicitud para{' '}
            <strong style={{ color: '#f472b6' }}>{servicioSeleccionado?.nombre}</strong>.
            Pronto recibirás la confirmación de tu turno. 💅
          </p>
          <button onClick={reiniciar} className="btn-secondary" style={{ margin: '0 auto' }}>
            Hacer otra reserva
          </button>
        </div>
      )}
    </section>
  )
}
