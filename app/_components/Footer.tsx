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

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.8125rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© {new Date().getFullYear()} {brandName}. Todos los derechos reservados.</span>
          <Link href="/login" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover:text-white" title="Acceso de Administración">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
            </svg>
            <span className="sr-only">Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
