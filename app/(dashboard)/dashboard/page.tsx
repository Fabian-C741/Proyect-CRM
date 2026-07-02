import { getClientesCount } from '@/lib/dal/clientes'
import { getCursosCount, getCitasPendientesCount } from '@/lib/dal/cursos'
import StatCard from '@/app/_components/StatCard'

export default async function DashboardPage() {
  // Ejecutar queries en paralelo gracias al DAL y Promise.all
  const [totalClientes, totalCursos, citasPendientes] = await Promise.all([
    getClientesCount(),
    getCursosCount(),
    getCitasPendientesCount(),
  ])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Resumen General</h1>
        <p className="text-slate-400">
          Un vistazo rápido al estado de tu negocio.
        </p>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Clientes"
          value={totalClientes}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
        />
        <StatCard
          title="Citas Pendientes"
          value={citasPendientes}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          }
        />
        <StatCard
          title="Cursos Activos"
          value={totalCursos}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          }
        />
      </div>
    </div>
  )
}
