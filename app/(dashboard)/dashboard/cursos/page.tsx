import { getCursos } from '@/lib/dal/cursos'
import NuevoCursoModal from './NuevoCursoModal'

export default async function CursosPage() {
  const cursos = await getCursos()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Cursos y Servicios</h1>
          <p className="text-slate-400">Gestiona tus servicios ofrecidos.</p>
        </div>
        <NuevoCursoModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cursos.length === 0 ? (
          <div className="col-span-full card-glass p-8 text-center text-slate-400">
            No tienes cursos registrados aún.
          </div>
        ) : (
          cursos.map((curso) => (
            <div key={curso.id} className="card-glass p-6 flex flex-col h-full">
              <h3 className="text-lg font-bold text-white mb-2">{curso.nombre}</h3>
              {curso.descripcion && (
                <p className="text-sm text-slate-400 mb-4 flex-grow line-clamp-3">
                  {curso.descripcion}
                </p>
              )}
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                <span className="font-medium text-pink-500">${curso.precio}</span>
                {curso.duracion_horas && (
                  <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                    {curso.duracion_horas}h
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
