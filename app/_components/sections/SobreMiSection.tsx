type Props = {
  texto: string | null
  imagenUrl: string | null
}

export default function SobreMiSection({ texto, imagenUrl }: Props) {
  if (!texto && !imagenUrl) return null

  return (
    <section id="sobre-mi" style={{ width: '100%', maxWidth: 800, margin: '0 auto 6rem', textAlign: 'left' }}>
      <div className="card-glass" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        {imagenUrl && (
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: `url(${imagenUrl}) center/cover`, border: '3px solid rgba(236,72,153,0.4)', flexShrink: 0 }} />
        )}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Sobre Mí</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
            {texto}
          </p>
        </div>
      </div>
    </section>
  )
}
