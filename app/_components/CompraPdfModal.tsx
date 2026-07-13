'use client'

import { useState } from 'react'
import type { Curso } from '@/lib/definitions'

type Props = {
  curso: Curso
  onClose: () => void
}

export default function CompraPdfModal({ curso, onClose }: Props) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('curso_id', curso.id)

    try {
      const res = await fetch('/api/comprar-pdf', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()

      if (result.error) {
        setError(result.error)
        setIsPending(false)
        return
      }

      // Redirigir a WhatsApp con el link de descarga
      if (result.waUrl) {
        window.open(result.waUrl, '_blank')
      }

      onClose()
    } catch {
      setError('Error de conexión. Intentalo de nuevo.')
      setIsPending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-surface-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Comprar {curso.nombre}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{error}</div>
          )}

          <p className="text-sm text-slate-300">Completá tus datos para recibir el link de descarga.</p>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre *</label>
            <input name="nombre" type="text" required placeholder="Tu nombre" className="input-base" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">WhatsApp *</label>
            <input name="telefono" type="tel" required placeholder="ej. 5493731509112" className="input-base" />
            <p className="text-xs text-slate-500 mt-1">Con código de país, sin + ni espacios</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <input name="email" type="email" placeholder="opcional, para recibir el link por correo" className="input-base" />
          </div>

          <div className="pt-2">
            <button type="submit" className="btn-primary w-full justify-center" disabled={isPending}>
              {isPending ? 'Procesando...' : `Comprar $${curso.precio.toLocaleString('es-AR')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
