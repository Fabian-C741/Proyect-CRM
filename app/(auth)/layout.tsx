import type { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Acceso — Admin',
}

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('site_settings').select('brand_name').single()
  const brandName = data?.brand_name || 'CRM Maquilladora'

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--surface-bg)',
      }}
    >
      {/* Orbe decorativo superior-izquierdo */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(1px)',
        }}
      />
      {/* Orbe decorativo inferior-derecho */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(1px)',
        }}
      />
      {/* Orbe sutil centro */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid decorativo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Contenedor principal */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 440,
          padding: '1.5rem 1.25rem',
        }}
      >
        {/* Logo / Marca */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          {/* Logo y Nombre Dinámico */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4), inset 0 2px 0 rgba(255,255,255,0.2)',
              marginBottom: '1.5rem',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L9.5 8.5H2L8 13.5L5.5 21L12 16L18.5 21L16 13.5L22 8.5H14.5L12 1Z" />
            </svg>
          </div>
          
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: '0.5rem',
            }}
          >
            {brandName}
          </h1>
          <p
            style={{
              color: 'var(--text-secondary)',
              marginTop: 8,
              fontSize: '0.9375rem',
              fontWeight: 400,
            }}
          >
            Gestión profesional de tu negocio
          </p>
        </div>

        {/* Tarjeta de contenido */}
        <div
          style={{
            background: 'rgba(22, 22, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '2.25rem 2rem',
            boxShadow:
              '0 24px 64px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset',
            animation: 'authFadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
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
          © {new Date().getFullYear()} CRM Maquilladora. Todos los derechos
          reservados.
        </p>
      </div>

      <style>{`
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  )
}
