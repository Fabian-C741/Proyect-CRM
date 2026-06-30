import Link from 'next/link'

export default function Footer({ brandName }: { brandName: string }) {
  return (
    <footer
      style={{
        padding: '3rem 1.5rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
          {brandName}
        </h3>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 400, margin: 0, lineHeight: 1.5 }}>
          Realzando tu belleza con maquillaje profesional para cada ocasión especial.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', margin: '1rem 0' }}>
          {/* Iconos de RRSS (Placeholders) */}
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>📸</span>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>📱</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '1rem 0' }} />

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', fontSize: '0.8125rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© {new Date().getFullYear()} {brandName}. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  )
}
