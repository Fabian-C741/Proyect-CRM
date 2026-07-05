import Link from 'next/link'
import { getAgenda, getCursos } from '@/lib/dal/cursos'
import { getClientes } from '@/lib/dal/clientes'
import { getReservasWeb } from '@/lib/dal/reservas'
import { getSiteSettings } from '@/lib/dal/landing'
import NuevaCitaModal from './NuevaCitaModal'
import CambiarEstadoCita from './CambiarEstadoCita'
import AccionesReservaWeb from './AccionesReservaWeb'
import type { Agenda } from '@/lib/definitions'

export const dynamic = 'force-dynamic'

export default async function AgendaPage() {
  const [agenda, clientes, cursos, reservasWeb, settings] = await Promise.all([
    getAgenda(50),
    getClientes(),
    getCursos(),
    getReservasWeb(50),
    getSiteSettings(),
  ])

  const whatsappNumber = settings?.whatsapp_number || ''

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* ───── RESERVAS WEB ───── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 className="text-xl font-bold text-white">Reservas Web</h2>
            <p className="text-slate-400 text-sm">
              Solicitudes recibidas desde tu landing page —{' '}
              <span style={{ color: '#facc15', fontWeight: 600 }}>
                {reservasWeb.filter(r => r.estado === 'pendiente').length} pendientes
              </span>
            </p>
          </div>
        </div>

        <div className="card-glass overflow-hidden">
          {reservasWeb.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
              Aún no hay reservas web. Cuando un visitante reserve desde tu landing, aparecerá aquí.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {reservasWeb.map((reserva) => {
                const fecha = new Date(reserva.fecha_preferida + 'T12:00:00')
                const isNew = reserva.estado === 'pendiente'
                return (
                  <div
                    key={reserva.id}
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      alignItems: 'center',
                      background: isNew ? 'rgba(234,179,8,0.03)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    {/* Fecha */}
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', width: 56, height: 56, borderRadius: 10,
                      background: 'rgba(236,72,153,0.1)', color: '#f472b6', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {fecha.toLocaleString('es', { month: 'short' })}
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>
                        {fecha.getDate()}
                      </span>
                    </div>

                    {/* Info visitante */}
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <p style={{ fontWeight: 700, color: 'white', marginBottom: '0.2rem' }}>
                        {reserva.nombre_visitante}
                        {isNew && (
                          <span style={{
                            marginLeft: '0.5rem', padding: '0.1rem 0.4rem', borderRadius: 9999,
                            background: 'rgba(234,179,8,0.2)', color: '#facc15',
                            fontSize: '0.65rem', fontWeight: 700,
                          }}>NUEVA</span>
                        )}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        📞 {reserva.telefono_visitante}
                        {reserva.hora_preferida && ` · ⏰ ${reserva.hora_preferida}`}
                      </p>
                    </div>

                    {/* Servicio y precio */}
                    <div style={{ minWidth: 160 }}>
                      <p style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>
                        {reserva.servicio_nombre}
                      </p>
                      {reserva.servicio_precio != null && reserva.servicio_precio > 0 && (
                        <p style={{ color: '#f472b6', fontWeight: 700, fontSize: '0.9rem' }}>
                          ${reserva.servicio_precio.toLocaleString('es-AR')}
                        </p>
                      )}
                      {reserva.notas && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          💬 {reserva.notas}
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    <AccionesReservaWeb
                      reservaId={reserva.id}
                      estadoActual={reserva.estado}
                      nombreVisitante={reserva.nombre_visitante}
                      telefonoVisitante={reserva.telefono_visitante}
                      servicioNombre={reserva.servicio_nombre}
                      fechaPreferida={reserva.fecha_preferida}
                      horaPreferida={reserva.hora_preferida}
                      whatsappNumber={whatsappNumber}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ───── AGENDA INTERNA ───── */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Agenda</h2>
            <p className="text-slate-400 text-sm">Citas programadas — {agenda.length} registradas.</p>
          </div>
          <NuevaCitaModal clientes={clientes} cursos={cursos} />
        </div>

        <div className="card-glass overflow-hidden">
          {agenda.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No tienes citas programadas próximamente.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {agenda.map((cita: Agenda) => {
                const date = new Date(cita.fecha)
                return (
                  <div key={cita.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-pink-500/10 text-pink-500 flex-shrink-0">
                      <span className="text-xs font-semibold uppercase">{date.toLocaleString('es', { month: 'short' })}</span>
                      <span className="text-xl font-bold">{date.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {cita.clientes ? (
                        <Link href={`/dashboard/clientes/${cita.cliente_id}`} className="text-white font-medium hover:text-pink-400 transition-colors">
                          {cita.clientes.nombre}
                        </Link>
                      ) : (
                        <span className="text-slate-500 font-medium">Cliente eliminado</span>
                      )}
                      <p className="text-sm text-slate-400 truncate">
                        {date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                        {' • '}
                        {cita.cursos?.nombre || 'Sin servicio específico'}
                      </p>
                    </div>
                    <CambiarEstadoCita citaId={cita.id} estadoActual={cita.estado} />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
