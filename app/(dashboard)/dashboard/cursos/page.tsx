import { getCursos } from '@/lib/dal/cursos'
import NuevoCursoModal from './NuevoCursoModal'
import CursosClient from './CursosClient'

export default async function CursosPage() {
  const cursos = await getCursos()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Cursos y Productos</h1>
          <p className="text-slate-400">Gestiona tus servicios, cursos, PDFs y eBooks.</p>
        </div>
        <NuevoCursoModal />
      </div>

      <CursosClient cursos={cursos} />
    </div>
  )
}
