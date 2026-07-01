import Link from 'next/link'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  // Intenta obtener configuración de la DB, pero usa valores por defecto si falla
  let data: Record<string, string> | null = null
  try {
    const supabase = await createSupabaseServerClient()
    const result = await supabase.from('site_settings').select('*').single()
    data = result.data
  } catch {
    // Supabase no disponible o credenciales no configuradas — usa defaults
  }

  const pageConfig = {
    brandName: data?.brand_name || 'CRM Maquilladora',
    heroTitle: data?.hero_title || 'Realza tu belleza natural',
    heroSubtitle: data?.hero_subtitle || 'Servicios profesionales de maquillaje para eventos, novias y cursos de automaquillaje.',
    heroCtaText: data?.hero_cta_text || 'Reserva tu turno',
    whatsappNumber: data?.whatsapp_number || '5491112345678',
  }
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-surface-bg">
      {/* Orbes decorativos de fondo (mismo estilo que el login) */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      <Navbar brandName={pageConfig.brandName} />

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 pt-32">
        {/* Hero Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'authFadeUp 0.6s ease-out forwards' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.375rem 1rem',
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.2)',
              borderRadius: '9999px',
              color: '#f472b6',
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
            }}
          >
            ✨ ESTUDIO DE MAQUILLAJE
          </div>
          
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            {pageConfig.heroTitle}
          </h1>
          
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            {pageConfig.heroSubtitle}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href={`https://wa.me/${pageConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: '14px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM12.04 20.15C10.57 20.15 9.15 19.76 7.9 19.01L7.61 18.84L4.54 19.65L5.36 16.65L5.18 16.35C4.38 15.02 3.96 13.5 3.96 11.91C3.96 7.46 7.59 3.83 12.04 3.83C16.49 3.83 20.12 7.46 20.12 11.91C20.12 16.36 16.49 20.15 12.04 20.15ZM16.49 14.5C16.24 14.38 15.03 13.78 14.81 13.7C14.59 13.62 14.42 13.58 14.26 13.82C14.1 14.07 13.64 14.61 13.5 14.77C13.36 14.94 13.21 14.96 12.97 14.83C12.72 14.71 11.93 14.45 10.99 13.61C10.26 12.95 9.77 12.14 9.63 11.89C9.48 11.64 9.61 11.51 9.74 11.38C9.85 11.27 9.98 11.1 10.1 10.95C10.22 10.81 10.26 10.7 10.34 10.54C10.42 10.37 10.38 10.23 10.32 10.1C10.26 9.98 9.77 8.78 9.57 8.28C9.37 7.8 9.17 7.86 9.02 7.85C8.88 7.85 8.71 7.85 8.55 7.85C8.39 7.85 8.12 7.91 7.9 8.16C7.67 8.4 7.04 8.98 7.04 10.16C7.04 11.34 7.94 12.48 8.06 12.65C8.18 12.82 9.77 15.35 12.28 16.41C12.88 16.66 13.35 16.81 13.71 16.92C14.31 17.11 14.86 17.08 15.29 17.01C15.78 16.93 16.8 16.39 17.01 15.79C17.22 15.19 17.22 14.67 17.16 14.56C17.09 14.44 16.93 14.38 16.68 14.25" />
              </svg>
              {pageConfig.heroCtaText}
            </Link>
          </div>
        </div>

        {/* --- Sección de Servicios --- */}
        <section id="servicios" style={{ width: '100%', maxWidth: '1000px', margin: '6rem auto 4rem', textAlign: 'left' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>Servicios Destacados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Tarjeta de Servicio 1 */}
            <div className="card-glass" style={{ overflow: 'hidden', padding: 0, transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ height: '200px', background: 'url(https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=800&auto=format&fit=crop) center/cover' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Maquillaje Social</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Look perfecto y duradero para eventos, fiestas y reuniones importantes.</p>
                <Link href={`https://wa.me/${pageConfig.whatsappNumber}?text=Hola! Quiero info sobre Maquillaje Social`} target="_blank" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Consultar</Link>
              </div>
            </div>

            {/* Tarjeta de Servicio 2 */}
            <div className="card-glass" style={{ overflow: 'hidden', padding: 0, transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ height: '200px', background: 'url(https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop) center/cover' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Maquillaje de Novia</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Prueba y maquillaje para el día más especial, con productos de alta gama.</p>
                <Link href={`https://wa.me/${pageConfig.whatsappNumber}?text=Hola! Quiero info sobre Maquillaje para Novias`} target="_blank" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Consultar</Link>
              </div>
            </div>

            {/* Tarjeta de Servicio 3 */}
            <div className="card-glass" style={{ overflow: 'hidden', padding: 0, transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ height: '200px', background: 'url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop) center/cover' }}></div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cursos de Automaquillaje</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>Aprende a conocer tu rostro y las mejores técnicas para el día a día.</p>
                <Link href={`https://wa.me/${pageConfig.whatsappNumber}?text=Hola! Quiero info sobre Cursos`} target="_blank" className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Consultar</Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- Sección de Galería / Portfolio --- */}
        <section id="galeria" style={{ width: '100%', maxWidth: '1000px', margin: '2rem auto 6rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}>Mis Trabajos</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Una muestra de los looks que podemos crear juntas.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ height: '250px', borderRadius: '12px', background: 'url(https://images.unsplash.com/photo-1512496015851-a1cbf39a5180?q=80&w=600&auto=format&fit=crop) center/cover' }}></div>
            <div style={{ height: '250px', borderRadius: '12px', background: 'url(https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop) center/cover' }}></div>
            <div style={{ height: '250px', borderRadius: '12px', background: 'url(https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=600&auto=format&fit=crop) center/cover' }}></div>
            <div style={{ height: '250px', borderRadius: '12px', background: 'url(https://images.unsplash.com/photo-1516975080661-460d3d52c41c?q=80&w=600&auto=format&fit=crop) center/cover' }}></div>
          </div>
        </section>
      </main>

      <Footer brandName={pageConfig.brandName} />

      <style>{`
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  )
}
