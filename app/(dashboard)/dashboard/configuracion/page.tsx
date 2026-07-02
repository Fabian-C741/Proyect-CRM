import { getCurrentUser } from '@/lib/dal/auth'
import { logoutAction } from '@/app/(auth)/login/logoutAction'

export default async function ConfiguracionPage() {
  const user = await getCurrentUser()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Configuración</h1>
        <p className="text-slate-400">Ajustes de tu cuenta y preferencias del sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Perfil Cuenta */}
        <div className="card-glass p-6 md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-3">Detalles de la Cuenta</h2>
          
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ID de Usuario</span>
              <span className="text-sm font-mono text-slate-300 bg-white/5 px-2 py-1 rounded select-all block w-fit">
                {user?.id || 'No disponible'}
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Correo electrónico</span>
              <span className="text-sm text-slate-300 font-medium">{user?.email || 'No disponible'}</span>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Fecha de registro</span>
              <span className="text-sm text-slate-300">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-AR', { dateStyle: 'long' }) : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Card Acciones de Sesión */}
        <div className="card-glass p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white border-b border-white/5 pb-3 mb-4">Sesión</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Puedes cerrar sesión de forma segura aquí. Se borrarán tus cookies de acceso local.
            </p>
          </div>
          
          <form action={logoutAction} className="mt-6">
            <button type="submit" className="btn-secondary w-full justify-center text-red-400 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
