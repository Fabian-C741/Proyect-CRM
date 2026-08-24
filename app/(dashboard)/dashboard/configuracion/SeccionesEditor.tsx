'use client'

import { useState } from 'react'
import { saveSeccionesAction } from './actions'
import { TIPOS_PRODUCTO_INFO, getTipoInfo, type SeccionLandingConfig, type SeccionesLanding } from '@/lib/definitions'

type EstadoSeccion = Required<Pick<SeccionLandingConfig, 'visible' | 'titulo' | 'descripcion' | 'icono'>> & {
  orden: number
  personalizada: boolean
}
type EstadoSecciones = Record<string, EstadoSeccion>

const ORDEN_BASE: Record<string, number> = {
  servicio: 0,
  curso: 1,
  pdf: 2,
  ebook: 3,
}

function estadoInicial(config: SeccionesLanding | null): EstadoSecciones {
  const estado: EstadoSecciones = {}
  // Secciones base (siempre presentes)
  for (const [tipo, info] of Object.entries(TIPOS_PRODUCTO_INFO)) {
    const guardado = config?.[tipo]
    estado[tipo] = {
      visible: guardado?.visible !== false,
      // Pre-cargar los valores reales que se ven en la landing (defaults incluidos) para que sean editables
      titulo: guardado?.titulo ?? info.label,
      descripcion: guardado?.descripcion ?? info.desc,
      // Si hay config guardada se respeta tal cual (incluso vacío); el default solo aplica sin config
      icono: typeof guardado?.icono === 'string' ? guardado.icono : info.icon,
      orden: guardado?.orden ?? ORDEN_BASE[tipo],
      personalizada: false,
    }
  }
  // Secciones personalizadas guardadas
  for (const [tipo, cfg] of Object.entries(config || {})) {
    if (tipo in TIPOS_PRODUCTO_INFO || tipo in estado) continue
    if (cfg?.personalizada === false) continue
    estado[tipo] = {
      visible: cfg?.visible !== false,
      titulo: cfg?.titulo || getTipoInfo(tipo).label,
      descripcion: cfg?.descripcion || '',
      icono: typeof cfg?.icono === 'string' ? cfg.icono : '📦',
      orden: cfg?.orden ?? 100 + Object.keys(estado).length,
      personalizada: true,
    }
  }
  return estado
}

function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30)
}

export default function SeccionesEditor({ configInicial }: { configInicial: SeccionesLanding | null }) {
  const [estado, setEstado] = useState<EstadoSecciones>(() => estadoInicial(configInicial))
  const [guardando, setGuardando] = useState(false)
  const [message, setMessage] = useState('')
  const [nuevaNombre, setNuevaNombre] = useState('')
  const [nuevoIcono, setNuevoIcono] = useState('✨')

  const actualizar = (tipo: string, campo: keyof EstadoSeccion, valor: string | boolean | number) => {
    setEstado(prev => ({ ...prev, [tipo]: { ...prev[tipo], [campo]: valor } }))
  }

  const agregarSeccion = () => {
    const nombre = nuevaNombre.trim()
    if (!nombre) {
      setMessage('Poné un nombre para la sección nueva.')
      return
    }
    const key = slugify(nombre) || `seccion_${Date.now()}`
    if (key in estado) {
      setMessage(`Ya existe una sección "${nombre}".`)
      return
    }
    const maxOrden = Math.max(0, ...Object.values(estado).map(s => s.orden ?? 0))
    setEstado(prev => ({
      ...prev,
      [key]: {
        visible: true,
        titulo: nombre.charAt(0).toUpperCase() + nombre.slice(1),
        descripcion: '',
        icono: nuevoIcono.trim() || '📦',
        orden: maxOrden + 1,
        personalizada: true,
      },
    }))
    setNuevaNombre('')
    setNuevoIcono('✨')
    setMessage('')
  }

  const eliminarSeccion = (tipo: string) => {
    setEstado(prev => {
      const copia = { ...prev }
      delete copia[tipo]
      return copia
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setGuardando(true)
    setMessage('')

    const fd = new FormData()
    fd.set('secciones', JSON.stringify(estado))
    const result = await saveSeccionesAction(fd)

    if (result.error) setMessage(result.error)
    else setMessage('✅ Secciones actualizadas. Los cambios ya están en tu landing.')

    setGuardando(false)
  }

  // Ordenar: por campo orden
  const tiposOrdenados = Object.keys(estado).sort((a, b) => (estado[a].orden ?? 99) - (estado[b].orden ?? 99))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-slate-400 text-sm">
        Personalizá el ícono, título y descripción de cada sección, ocultá las que no uses o creá secciones nuevas.
        Los productos se agrupan por su <b>Tipo</b> — creá uno nuevo acá y va a aparecer en el desplegable al crear productos.
      </p>

      {message && (
        <div style={{ padding: '1rem', borderRadius: 8, background: message.startsWith('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: message.startsWith('✅') ? '#10b981' : '#ef4444', fontSize: '0.875rem' }}>
          {message}
        </div>
      )}

      {/* Crear sección nueva */}
      <div className="p-4 rounded-xl border border-dashed border-pink-500/30 bg-pink-500/[0.04]">
        <p className="text-sm font-semibold text-white mb-3">➕ Nueva sección</p>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            value={nuevoIcono}
            onChange={e => setNuevoIcono(e.target.value)}
            placeholder="✨"
            maxLength={4}
            title="Ícono (emoji)"
            className="input-base text-center"
            style={{ width: 60 }}
          />
          <input
            type="text"
            value={nuevaNombre}
            onChange={e => setNuevaNombre(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregarSeccion() } }}
            placeholder="Nombre — ej. Promociones, Combos..."
            maxLength={30}
            className="input-base text-sm flex-1"
            style={{ minWidth: 200 }}
          />
          <button type="button" onClick={agregarSeccion} className="btn-secondary text-xs whitespace-nowrap">
            Agregar
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {tiposOrdenados.map(tipo => {
          const cfg = estado[tipo]
          return (
            <div key={tipo} className="p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3" style={{ opacity: cfg.visible === false ? 0.55 : 1, transition: 'opacity 0.2s' }}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-sm truncate">
                  {cfg.icono ? `${cfg.icono} ` : ''}{cfg.titulo?.trim() || tipo}
                </span>
                <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={cfg.visible !== false}
                    onChange={e => actualizar(tipo, 'visible', e.target.checked)}
                    style={{ width: 15, height: 15, accentColor: '#ec4899', cursor: 'pointer' }}
                  />
                  <span className="text-xs text-slate-400">Visible</span>
                </label>
              </div>

              <div className="flex gap-2">
                <div style={{ width: 70 }}>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ícono</label>
                  <input
                    type="text"
                    value={cfg.icono || ''}
                    onChange={e => actualizar(tipo, 'icono', e.target.value)}
                    maxLength={4}
                    className="input-base text-center text-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Título</label>
                  <input
                    type="text"
                    value={cfg.titulo || ''}
                    onChange={e => actualizar(tipo, 'titulo', e.target.value)}
                    placeholder={tipo in TIPOS_PRODUCTO_INFO ? TIPOS_PRODUCTO_INFO[tipo as keyof typeof TIPOS_PRODUCTO_INFO].label : tipo}
                    maxLength={120}
                    className="input-base text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Descripción / Mensaje</label>
                <textarea
                  value={cfg.descripcion || ''}
                  onChange={e => actualizar(tipo, 'descripcion', e.target.value)}
                  placeholder="Texto opcional bajo el título (vacío = sin texto)"
                  maxLength={400}
                  rows={2}
                  className="input-base text-sm"
                  style={{ resize: 'none' }}
                />
              </div>

              {cfg.personalizada && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { if (confirm(`¿Eliminar la sección "${cfg.titulo || tipo}"?`)) eliminarSeccion(tipo) }}
                    className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg px-2 py-1"
                  >
                    🗑️ Eliminar sección
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-slate-500">
        Nota: al crear una sección nueva hay que ejecutar antes la migración{' '}
        <code className="bg-white/5 px-1 rounded">supabase_migration_tipos_personalizados.sql</code> en Supabase,
        si no los productos con ese tipo no se van a poder guardar.
      </p>

      <div className="flex justify-end pt-2">
        <button type="submit" className="btn-primary" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar Secciones'}
        </button>
      </div>
    </form>
  )
}
