'use client'

import { useState } from 'react'
import type { Pedido } from '@/lib/definitions'
import { aprobarPedidoAction } from './actions'

const ESTADO_LABEL: Record<string, { text: string; color: string }> = {
  pendiente: { text: 'Pendiente (MP)', color: 'bg-yellow-500/10 text-yellow-400' },
  pendiente_manual: { text: 'Transferencia pendiente', color: 'bg-orange-500/10 text-orange-400' },
  pagado: { text: 'Pagado', color: 'bg-green-500/10 text-green-400' },
  expirado: { text: 'Expirado', color: 'bg-slate-500/10 text-slate-400' },
  cancelado: { text: 'Cancelado', color: 'bg-red-500/10 text-red-400' },
}

export default function VentasClient({ pedidos, nombres }: { pedidos: Pedido[]; nombres: Record<string, string> }) {
  const [procesando, setProcesando] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const aprobar = async (id: string) => {
    setProcesando(id)
    setMessage('')
    const res = await aprobarPedidoAction(id)
    setProcesando(null)
    if (res.error) setMessage(res.error)
    else setMessage('✅ Pedido aprobado y entregado.')
  }

  if (pedidos.length === 0) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Ventas</h1>
        <div className="card-glass p-12 text-center">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
          <p className="text-white font-semibold text-lg mb-2">Aún no tenés ventas</p>
          <p className="text-slate-400 text-sm">Las compras por MercadoPago y transferencia bancaria aparecerán acá.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Ventas</h1>
      <p className="text-slate-400 text-sm">Las transferencias bancarias quedan en estado “pendiente” hasta que las confirmes.</p>

      {message && (
        <div style={{ padding: '1rem', borderRadius: 8, background: message.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.startsWith('✅') ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400 text-xs uppercase tracking-wider">
              <tr className="border-b border-white/5">
                <th className="text-left p-4">Fecha</th>
                <th className="text-left p-4">Producto</th>
                <th className="text-left p-4">Cliente</th>
                <th className="text-left p-4">Monto</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-left p-4">Comprobante</th>
                <th className="text-right p-4">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => {
                const e = ESTADO_LABEL[p.estado] || { text: p.estado, color: 'bg-slate-500/10 text-slate-400' }
                return (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="p-4 text-slate-300">{new Date(p.created_at).toLocaleString('es-AR')}</td>
                    <td className="p-4 text-white">{p.producto_id ? (nombres[p.producto_id] || p.tipo) : p.tipo}</td>
                    <td className="p-4 text-slate-300">
                      <div>{p.nombre_cliente || '-'}</div>
                      {p.email && <div className="text-xs text-slate-500">{p.email}</div>}
                      {p.telefono && <div className="text-xs text-slate-500">{p.telefono}</div>}
                    </td>
                    <td className="p-4 text-pink-400 font-semibold">${Number(p.monto).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${e.color}`}>{e.text}</span>
                    </td>
                    <td className="p-4">
                      {p.comprobante_url ? (
                        <a href={p.comprobante_url} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 text-xs">Ver</a>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-right">
                      {p.estado === 'pendiente_manual' && (
                        <button
                          onClick={() => aprobar(p.id)}
                          disabled={procesando === p.id}
                          className="btn-primary text-xs"
                        >
                          {procesando === p.id ? '...' : 'Aprobar y entregar'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
