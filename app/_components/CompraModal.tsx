'use client'

import { useState } from 'react'
import type { Curso } from '@/lib/definitions'

type Banco = { cbu?: string | null; alias_cbu?: string | null; banco?: string | null; titular_cuenta?: string | null }

type Props = {
  curso: Curso
  banco?: Banco
  onClose: () => void
}

export default function CompraModal({ curso, banco, onClose }: Props) {
  const modo = curso.modo_venta
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [comprobante, setComprobante] = useState<File | null>(null)
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'listo' | 'error'>('idle')
  const [mensaje, setMensaje] = useState('')

  const esTransferencia = modo === 'transferencia'

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || !telefono.trim()) {
      setMensaje('Nombre y teléfono son obligatorios.')
      setEstado('error')
      return
    }
    setEstado('enviando')
    setMensaje('')

    try {
      if (esTransferencia) {
        const fd = new FormData()
        fd.set('curso_id', curso.id)
        fd.set('nombre', nombre)
        fd.set('email', email)
        fd.set('telefono', telefono)
        if (comprobante) fd.set('comprobante', comprobante)
        const res = await fetch('/api/crear-pedido-manual', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'No se pudo registrar el pago')
        setEstado('listo')
      } else {
        const fd = new FormData()
        fd.set('curso_id', curso.id)
        fd.set('nombre', nombre)
        fd.set('email', email)
        fd.set('telefono', telefono)
        const res = await fetch('/api/crear-preferencia', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'No se pudo iniciar el pago')
        if (data.initPoint) window.location.href = data.initPoint
      }
    } catch (err: any) {
      setMensaje(err?.message || 'Ocurrió un error')
      setEstado('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={enviar} className="flex flex-col w-full max-w-lg max-h-[90vh] bg-surface-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {esTransferencia ? 'Pagar por transferencia' : 'Pagar con MercadoPago'}
          </h2>
          <button onClick={onClose} type="button" className="text-slate-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <p className="text-slate-300">
            <span className="font-semibold text-white">{curso.nombre}</span>
            {typeof curso.precio === 'number' && (
              <span className="text-pink-400 font-bold ml-2">${curso.precio.toLocaleString('es-AR')}</span>
            )}
          </p>

          {esTransferencia && (
            <div className="rounded-xl bg-white/5 p-4 space-y-1 text-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Datos para transferir</p>
              {banco?.titular_cuenta && <p><span className="text-slate-400">Titular:</span> {banco.titular_cuenta}</p>}
              {banco?.banco && <p><span className="text-slate-400">Banco:</span> {banco.banco}</p>}
              {banco?.cbu && <p><span className="text-slate-400">CBU:</span> {banco.cbu}</p>}
              {banco?.alias_cbu && <p><span className="text-slate-400">Alias:</span> {banco.alias_cbu}</p>}
              {!banco?.cbu && !banco?.alias_cbu && (
                <p className="text-amber-400">El dueño todavía no cargó sus datos bancarios.</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} required className="input-base" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-base" placeholder="para enviarte el archivo" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Teléfono *</label>
            <input value={telefono} onChange={e => setTelefono(e.target.value)} required className="input-base" />
          </div>

          {esTransferencia && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Comprobante (opcional)</label>
              <input type="file" accept="image/*,application/pdf" onChange={e => setComprobante(e.target.files?.[0] || null)} className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20" />
            </div>
          )}

          {mensaje && (
            <div className="p-3 rounded-lg text-sm bg-red-500/10 border border-red-500/20 text-red-400">{mensaje}</div>
          )}

          {estado === 'listo' && (
            <div className="p-3 rounded-lg text-sm bg-green-500/10 border border-green-500/20 text-green-400">
              ✅ Recibimos tu pedido. Te enviaremos el archivo apenas se confirme la transferencia.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={estado === 'enviando'}>
            {estado === 'listo' ? 'Cerrar' : 'Cancelar'}
          </button>
          {estado !== 'listo' && (
            <button type="submit" className="btn-primary" disabled={estado === 'enviando'}>
              {estado === 'enviando' ? 'Procesando...' : esTransferencia ? 'Enviar pedido' : 'Ir a pagar'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
