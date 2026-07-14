'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Curso } from '@/lib/definitions'
import CompraPdfModal from '../CompraPdfModal'

const TIPO_CONFIG: Record<string, { icon: string; label: string; desc: string }> = {
  servicio: { icon: '💆', label: 'Servicios', desc: 'Maquillaje y tratamientos profesionales' },
  curso:    { icon: '🎓', label: 'Cursos', desc: 'Aprendé desde donde estés' },
  pdf:      { icon: '📄', label: 'PDFs', desc: 'Material descargable exclusivo' },
  ebook:    { icon: '📚', label: 'eBooks', desc: 'Guías completas para potenciar tu look' },
}

const ITEMS_POR_PAGINA = 4

type Props = {
  tipo: 'servicio' | 'curso' | 'pdf' | 'ebook'
  items: Curso[]
  whatsappNumber: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

export default function CategorySection({ tipo, items, whatsappNumber }: Props) {
  const [cantidad, setCantidad] = useState(ITEMS_POR_PAGINA)
  const [comprandoPdf, setComprandoPdf] = useState<Curso | null>(null)
  const config = TIPO_CONFIG[tipo]
  const visibles = items.slice(0, cantidad)
  const hayMas = cantidad < items.length

  if (items.length === 0) return null

  return (
    <>
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      id={tipo === 'servicio' ? 'servicios-productos' : tipo + 's'}
      style={{ width: '100%', maxWidth: 1000, margin: '0 auto 4rem', textAlign: 'left' }}
    >
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>{config.icon} {config.label}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{config.desc}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {visibles.map((c, idx) => {
          const waMsg = c.mensaje_whatsapp || `Hola! Quiero info sobre ${c.nombre}`
          return (
            <motion.div
              key={c.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              custom={idx}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="card-glass card-hover"
              style={{ overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}
            >
              {c.imagen_url ? (
                <div style={{ height: 160, background: `url(${c.imagen_url}) center/cover`, flexShrink: 0 }} />
              ) : (
                <div style={{ height: 80, background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                  {config.icon}
                </div>
              )}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {c.duracion_horas && (
                  <span style={{ alignSelf: 'flex-start', padding: '0.15rem 0.5rem', borderRadius: 9999, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                    ⏱ {c.duracion_horas}h
                  </span>
                )}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', lineHeight: 1.3 }}>{c.nombre}</h3>
                {c.descripcion && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>{c.descripcion}</p>}
                <div style={{ marginTop: 'auto' }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f472b6', marginBottom: '0.75rem' }}>
                    ${c.precio.toLocaleString('es-AR')}
                  </p>
                  {c.tipo === 'pdf' && c.archivo_url ? (
                    <button
                      onClick={() => setComprandoPdf(c)}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.8125rem', border: 'none', cursor: 'pointer' }}
                    >
                      🛒 Comprar ahora
                    </button>
                  ) : c.modo_venta === 'link_externo' && c.link_externo ? (
                    <Link href={c.link_externo} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                      🛒 Comprar ahora
                    </Link>
                  ) : (
                    <Link
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                    >
                      💬 {c.modo_venta === 'mensaje' ? 'Consultar' : 'Quiero este servicio'}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {hayMas && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => setCantidad(c => c + ITEMS_POR_PAGINA)}
            className="btn-secondary"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem', borderRadius: 10, border: 'none', cursor: 'pointer' }}
          >
            Mostrar más ({items.length - cantidad} restantes)
          </button>
        </div>
      )}
    </motion.section>

    {comprandoPdf && (
      <CompraPdfModal curso={comprandoPdf} onClose={() => setComprandoPdf(null)} />
    )}
    </>
  )
}
