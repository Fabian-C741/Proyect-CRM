'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'

type Props = {
  texto: string | null
  imagenUrl: string | null
}

// Altura máxima del texto colapsado (~5 líneas)
const ALTURA_COLAPSADA = 140

export default function SobreMiSection({ texto, imagenUrl }: Props) {
  const [expandido, setExpandido] = useState(false)
  const [desborda, setDesborda] = useState(false)
  const [alturaCompleta, setAlturaCompleta] = useState<number | undefined>(undefined)
  const textoRef = useRef<HTMLParagraphElement>(null)

  const medir = useCallback(() => {
    const el = textoRef.current
    if (!el) return
    const alto = el.scrollHeight
    setAlturaCompleta(alto)
    setDesborda(alto > ALTURA_COLAPSADA + 10)
  }, [])

  useEffect(() => {
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [medir, texto])

  if (!texto && !imagenUrl) return null

  const colapsado = desborda && !expandido

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      id="sobre-mi"
      style={{ width: '100%', maxWidth: 800, margin: '0 auto 6rem', textAlign: 'left' }}
    >
      <motion.div
        className="card-glass"
        style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        {imagenUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ width: 120, height: 120, borderRadius: '50%', background: `url(${imagenUrl}) center/cover`, border: '3px solid rgba(236,72,153,0.4)', flexShrink: 0 }}
          />
        )}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Sobre Mí</h2>
          {texto && (
            <p
              ref={textoRef}
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                fontSize: '1rem',
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                maxHeight: colapsado ? ALTURA_COLAPSADA : (alturaCompleta || 'none'),
                transition: 'max-height 0.45s ease',
                ...(colapsado
                  ? {
                      WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 96%)',
                      maskImage: 'linear-gradient(to bottom, black 55%, transparent 96%)',
                    }
                  : {}),
              }}
            >
              {texto}
            </p>
          )}
          {desborda && (
            <button
              type="button"
              onClick={() => setExpandido(e => !e)}
              style={{
                marginTop: '0.75rem',
                background: 'none',
                border: 'none',
                color: '#f472b6',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.25rem 1rem',
              }}
            >
              {expandido ? 'Mostrar menos ▴' : 'Seguir leyendo ▾'}
            </button>
          )}
        </div>
      </motion.div>
    </motion.section>
  )
}
