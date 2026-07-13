'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Curso } from '@/lib/definitions'

const TIPO_ICONS: Record<string, string> = {
  servicio: '💆', curso: '🎓', pdf: '📄', ebook: '📚',
}

const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'servicio', label: '💆 Servicios' },
  { key: 'curso', label: '🎓 Cursos' },
  { key: 'pdf', label: '📄 PDFs' },
  { key: 'ebook', label: '📚 eBooks' },
]

const ITEMS_POR_PAGINA = 8

type Props = {
  productos: Curso[]
  whatsappNumber: string
}

export default function ProductGridSection({ productos, whatsappNumber }: Props) {
  const [filtro, setFiltro] = useState('todos')
  const [cantidad, setCantidad] = useState(ITEMS_POR_PAGINA)

  const filtrados = useMemo(() => {
    if (filtro === 'todos') return productos
    return productos.filter(c => c.tipo === filtro)
  }, [productos, filtro])

  const visibles = filtrados.slice(0, cantidad)
  const hayMas = cantidad < filtrados.length

  const cambiarFiltro = (key: string) => {
    setFiltro(key)
    setCantidad(ITEMS_POR_PAGINA)
  }

  if (productos.length === 0) return null

  return (
    <section id="servicios-productos" style={{ width: '100%', maxWidth: 1000, margin: '0 auto 6rem', textAlign: 'left' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Servicios y Productos</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>Todo lo que ofrecemos para vos</p>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {FILTROS.map(f => (
          <button
            key={f.key}
            onClick={() => cambiarFiltro(f.key)}
            className={filtro === f.key ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', borderRadius: 9999, border: 'none', cursor: 'pointer' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
        {visibles.map((c) => {
          const waMsg = c.mensaje_whatsapp || `Hola! Quiero info sobre ${c.nombre}`
          const icon = TIPO_ICONS[c.tipo || 'servicio'] || '📦'
          return (
            <div key={c.id} className="card-glass card-hover" style={{ overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
              {c.imagen_url ? (
                <div style={{ height: 180, background: `url(${c.imagen_url}) center/cover`, flexShrink: 0 }} />
              ) : (
                <div style={{ height: 100, background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
                  {icon}
                </div>
              )}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: 9999, background: 'rgba(168,85,247,0.15)', color: '#c084fc', fontSize: '0.75rem', fontWeight: 600 }}>
                    {icon} {c.tipo?.charAt(0).toUpperCase() + (c.tipo?.slice(1) || '')}
                  </span>
                  {c.duracion_horas && (
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: 9999, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                      ⏱ {c.duracion_horas}h
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{c.nombre}</h3>
                {c.descripcion && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 }}>{c.descripcion}</p>}
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f472b6', marginBottom: '1rem' }}>
                    ${c.precio.toLocaleString('es-AR')}
                  </p>
                  {c.modo_venta === 'link_externo' && c.link_externo ? (
                    <Link href={c.link_externo} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      🛒 Comprar ahora
                    </Link>
                  ) : (
                    <Link
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      💬 {c.modo_venta === 'mensaje' ? 'Consultar' : 'Quiero este servicio'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cargar más */}
      {hayMas && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => setCantidad(c => c + ITEMS_POR_PAGINA)}
            className="btn-secondary"
            style={{ padding: '0.75rem 2rem', fontSize: '0.9375rem', borderRadius: 12, border: 'none', cursor: 'pointer' }}
          >
            Mostrar más ({filtrados.length - cantidad} restantes)
          </button>
        </div>
      )}

      {filtrados.length === 0 && (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
          No hay productos de esta categoría todavía.
        </p>
      )}
    </section>
  )
}
