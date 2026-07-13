import type { Testimonio } from '@/lib/definitions'

export default function TestimoniosSection({ testimonios }: { testimonios: Testimonio[] }) {
  if (testimonios.length === 0) return null

  return (
    <section id="testimonios" style={{ width: '100%', maxWidth: 1000, margin: '0 auto 6rem' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Lo que dicen mis clientas</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>Experiencias reales que hablan por sí solas</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
        {testimonios.map((t) => (
          <div key={t.id} className="card-glass" style={{ padding: '1.75rem' }}>
            <div style={{ color: '#facc15', fontSize: '1rem', marginBottom: '0.75rem' }}>
              {'★'.repeat(t.estrellas)}{'☆'.repeat(5 - t.estrellas)}
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem', fontStyle: 'italic' }}>
              &ldquo;{t.texto}&rdquo;
            </p>
            <p style={{ fontWeight: 600, color: '#f472b6', fontSize: '0.875rem' }}>— {t.nombre_cliente}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
