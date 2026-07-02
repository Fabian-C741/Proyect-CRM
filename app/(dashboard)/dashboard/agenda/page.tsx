import { getAgenda, getCursos } from '@/lib/dal/cursos'
import { getClientes } from '@/lib/dal/clientes'
import NuevaCitaModal from './NuevaCitaModal'

export default async function AgendaPage() {
  const [agenda, clientes, cursos] = await Promise.all([
    getAgenda(20),
    getClientes(),
    getCursos()
  ])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Agenda</h1>
          <p className="text-slate-400">Próximas citas y eventos.</p>
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
            {agenda.map((cita) => {
              const date = new Date(cita.fecha)
              return (
                <div key={cita.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-pink-500/10 text-pink-500 flex-shrink-0">
                    <span className="text-xs font-semibold uppercase">{date.toLocaleString('es', { month: 'short' })}</span>
                    <span className="text-xl font-bold">{date.getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">
                      {cita.clientes?.nombre || 'Cliente eliminado'}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })} • {cita.cursos?.nombre || 'Sin servicio específico'}
                    </p>
                  </div>
                  <div>
                    <span className={`badge ${cita.estado === 'pendiente' ? 'badge-yellow' : cita.estado === 'confirmado' ? 'badge-green' : 'badge-gray'}`}>
                      {cita.estado}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
