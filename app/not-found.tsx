import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-surface-950">
      <div className="text-center relative z-10 px-4">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500/50 to-purple-600/50">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mt-4 mb-2">
          Página no encontrada
        </h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link href="/" className="btn-primary inline-flex">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
