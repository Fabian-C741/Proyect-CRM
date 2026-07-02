import { getClientes } from '@/lib/dal/clientes'
import NuevoClienteModal from './NuevoClienteModal'

export default async function ClientesPage() {
  const clientes = await getClientes()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Clientes</h1>
          <p className="text-slate-400">Gestiona tu lista de clientes.</p>
        </div>
        <NuevoClienteModal />
      </div>

      <div className="card-glass overflow-hidden">
        {clientes.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No tienes clientes registrados aún.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{cliente.nombre}</td>
                  <td className="px-6 py-4">{cliente.email || '-'}</td>
                  <td className="px-6 py-4">{cliente.telefono || '-'}</td>
                  <td className="px-6 py-4">
                    <button className="text-pink-500 hover:text-pink-400 font-medium">Ver</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
