import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceso',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(236,72,153,0.18) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(168,85,247,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      {/* Grid decorativo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo / Marca */}
        <div className="text-center mb-8">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.35)',
              marginBottom: 16,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h1
            className="text-gradient"
            style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}
          >
            CRM Maquilladora
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9375rem' }}>
            Gestión profesional de tu negocio
          </p>
        </div>

        {/* Tarjeta de contenido */}
        <div className="card-glass animate-fade-in" style={{ padding: '2rem' }}>
          {children}
        </div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          © {new Date().getFullYear()} CRM Maquilladora. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
