import { getCliente } from '@/lib/dal/clientes'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ClienteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const cliente = await getCliente(resolvedParams.id)

  if (!cliente) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard/clientes"
          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{cliente.nombre}</h1>
          <p className="text-slate-400">Detalles del cliente</p>
        </div>
      </div>

      <div className="card-glass p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Email</h3>
            <p className="text-white font-medium">{cliente.email || 'No registrado'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Teléfono</h3>
            <p className="text-white font-medium">{cliente.telefono || 'No registrado'}</p>
          </div>
          <div className="col-span-full">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Notas</h3>
            <p className="text-white whitespace-pre-wrap bg-white/5 p-4 rounded-lg mt-2">
              {cliente.notas || 'Sin notas adicionales.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
