'use client'

import { useState, useTransition } from 'react'
import { updateClienteAction, deleteClienteAction } from './actions'
import type { Cliente, Agenda } from '@/lib/definitions'

interface ClienteDetailClientProps {
  cliente: Cliente
  citas: Agenda[]
}

export default function ClienteDetailClient({ cliente, citas }: ClienteDetailClientProps) {
  const [editando, setEditando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateClienteAction(cliente.id, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccessMsg('Cliente actualizado correctamente.')
        setEditando(false)
      }
    })
  }

  const handleDelete = () => {
    if (!confirm(`¿Eliminar a ${cliente.nombre}? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      await deleteClienteAction(cliente.id)
    })
  }

  const estadoClasses: Record<string, string> = {
    pendiente: 'badge-yellow',
    confirmado: 'badge-green',
    cancelado: 'badge-gray',
    completado: 'badge-blue',
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{cliente.nombre}</h1>
          <p className="text-slate-400 text-sm">
            Cliente desde {new Date(cliente.created_at).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setEditando(!editando); setError(null); setSuccessMsg(null) }}
            className="btn-secondary"
          >
            {editando ? 'Cancelar' : 'Editar'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>

      {/* Mensajes de feedback */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      {/* Datos del cliente */}
      <div className="card-glass p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Información del cliente</h2>

        {editando ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Nombre Completo *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                defaultValue={cliente.nombre}
                className="input-base"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={cliente.email ?? ''}
                className="input-base"
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Teléfono / WhatsApp
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                defaultValue={cliente.telefono ?? ''}
                className="input-base"
              />
            </div>

            <div>
              <label htmlFor="notas" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Notas / Observaciones
              </label>
              <textarea
                id="notas"
                name="notas"
                rows={4}
                defaultValue={cliente.notas ?? ''}
                className="input-base"
                style={{ resize: 'none' }}
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button type="button" onClick={() => setEditando(false)} className="btn-secondary" disabled={isPending}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={isPending}>
                {isPending ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Email</dt>
              <dd className="text-slate-200">{cliente.email || <span className="text-slate-500 italic">Sin email</span>}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Teléfono</dt>
              <dd className="text-slate-200">
                {cliente.telefono ? (
                  <a
                    href={`https://wa.me/${cliente.telefono.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    {cliente.telefono}
                  </a>
                ) : (
                  <span className="text-slate-500 italic">Sin teléfono</span>
                )}
              </dd>
            </div>
            {cliente.notas && (
              <div className="sm:col-span-2">
                <dt className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Notas</dt>
                <dd className="text-slate-300 whitespace-pre-wrap">{cliente.notas}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      {/* Historial de citas */}
      <div className="card-glass overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Historial de citas ({citas.length})
          </h2>
        </div>

        {citas.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic">
            Este cliente no tiene citas registradas.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {citas.map((cita) => {
              const date = new Date(cita.fecha)
              return (
                <div key={cita.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 transition-colors">
                  {/* Fecha */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-pink-500/10 text-pink-400 flex-shrink-0">
                    <span className="text-xs font-semibold uppercase leading-none">
                      {date.toLocaleString('es', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold leading-none">{date.getDate()}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {cita.cursos?.nombre || 'Sin servicio específico'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                      {cita.notas && ` • ${cita.notas}`}
                    </p>
                  </div>

                  {/* Estado */}
                  <span className={`badge ${estadoClasses[cita.estado] ?? 'badge-gray'} flex-shrink-0`}>
                    {cita.estado}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
