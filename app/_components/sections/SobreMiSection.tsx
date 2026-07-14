'use client'

import { motion } from 'framer-motion'

type Props = {
  texto: string | null
  imagenUrl: string | null
}

export default function SobreMiSection({ texto, imagenUrl }: Props) {
  if (!texto && !imagenUrl) return null

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
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Sobre Mí</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
            {texto}
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
