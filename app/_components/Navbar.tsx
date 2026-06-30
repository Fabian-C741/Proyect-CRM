import Link from 'next/link'

export default function Navbar({ brandName }: { brandName: string }) {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 1L9.5 8.5H2L8 13.5L5.5 21L12 16L18.5 21L16 13.5L22 8.5H14.5L12 1Z" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
          {brandName}
        </span>
      </div>

      <nav style={{ display: 'none', gap: '2rem', fontSize: '0.9375rem', fontWeight: 500 }} className="md:flex">
        <Link href="#servicios" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-white">Servicios</Link>
        <Link href="#galeria" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-white">Galería</Link>
        <Link href="#cursos" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover:text-white">Cursos</Link>
      </nav>
      
      {/* Botón de login removido para no confundir a los clientes */}
      <div style={{ width: 80 }}></div>
    </header>
  )
}
