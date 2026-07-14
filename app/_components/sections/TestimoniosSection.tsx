'use client'

import { motion } from 'framer-motion'
import type { Testimonio } from '@/lib/definitions'

export default function TestimoniosSection({ testimonios }: { testimonios: Testimonio[] }) {
  if (testimonios.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      id="testimonios"
      style={{ width: '100%', maxWidth: 1000, margin: '0 auto 6rem' }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Lo que dicen mis clientas</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>Experiencias reales que hablan por sí solas</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
        {testimonios.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="card-glass"
            style={{ padding: '1.75rem' }}
          >
            <div style={{ color: '#facc15', fontSize: '1rem', marginBottom: '0.75rem' }}>
              {'★'.repeat(t.estrellas)}{'☆'.repeat(5 - t.estrellas)}
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem', fontStyle: 'italic' }}>
              &ldquo;{t.texto}&rdquo;
            </p>
            <p style={{ fontWeight: 600, color: '#f472b6', fontSize: '0.875rem' }}>— {t.nombre_cliente}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
