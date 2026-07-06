import Link from 'next/link'
import Navbar from './_components/Navbar'
import Footer from './_components/Footer'
import ReservaSection from './_components/ReservaSection'
import {
  getSiteSettings,
  getServiciosPublicos,
  getPortfolioPublico,
  getTestimoniosPublicos,
  getCursosPublicos,
  getMenuItemsPublicos,
} from '@/lib/dal/landing'

export const dynamic = 'force-dynamic'


const FALLBACK_PORTFOLIO = [
  { id: 'p1', imagen_url: 'https://images.unsplash.com/photo-1512496015851-a1cbf39a5180?q=80&w=600&auto=format&fit=crop', descripcion: null },
  { id: 'p2', imagen_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop', descripcion: null },
  { id: 'p3', imagen_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?q=80&w=600&auto=format&fit=crop', descripcion: null },
  { id: 'p4', imagen_url: 'https://images.unsplash.com/photo-1516975080661-460d3d52c41c?q=80&w=600&auto=format&fit=crop', descripcion: null },
]

const TIPO_ICONS: Record<string, string> = {
  servicio: '💆', curso: '🎓', pdf: '📄', ebook: '📚',
}

export default async function LandingPage() {
  const [settings, serviciosDB, portfolioDB, testimonios, cursosDB, menuItems] = await Promise.all([
    getSiteSettings(),
    getServiciosPublicos(),
    getPortfolioPublico(),
    getTestimoniosPublicos(),
    getCursosPublicos(),
    getMenuItemsPublicos(),
  ])

  const pageConfig = {
    brandName:     settings?.brand_name    || 'CRM Maquilladora',
    heroTitle:     settings?.hero_title    || 'Realza tu belleza natural',
    heroSubtitle:  settings?.hero_subtitle || 'Servicios profesionales de maquillaje para eventos, novias y cursos de automaquillaje.',
    heroCtaText:   settings?.hero_cta_text || 'Reserva tu turno',
    whatsappNumber: settings?.whatsapp_number || '5491112345678',
    sobreMiTexto:  settings?.sobre_mi_texto || null,
    sobreMiImg:    settings?.sobre_mi_imagen_url || null,
  }

  const portfolio = portfolioDB.length > 0 ? portfolioDB : FALLBACK_PORTFOLIO

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-surface-bg">
      {/* Orbes decorativos */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)', pointerEvents: 'none', filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)', pointerEvents: 'none', filter: 'blur(40px)', zIndex: 0 }} />

      <Navbar brandName={pageConfig.brandName} menuItems={menuItems} />


      <main className="flex-1 relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-10">

        {/* ───── HERO ───── */}
        <div style={{ maxWidth: 800, margin: '0 auto 5rem', animation: 'authFadeUp 0.6s ease-out forwards' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 1rem', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: 9999, color: '#f472b6', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
            ✨ ESTUDIO DE MAQUILLAJE
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {pageConfig.heroTitle}
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            {pageConfig.heroSubtitle}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`https://wa.me/${pageConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: 14 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM12.04 20.15C10.57 20.15 9.15 19.76 7.9 19.01L7.61 18.84L4.54 19.65L5.36 16.65L5.18 16.35C4.38 15.02 3.96 13.5 3.96 11.91C3.96 7.46 7.59 3.83 12.04 3.83C16.49 3.83 20.12 7.46 20.12 11.91C20.12 16.36 16.49 20.15 12.04 20.15ZM16.49 14.5C16.24 14.38 15.03 13.78 14.81 13.7C14.59 13.62 14.42 13.58 14.26 13.82C14.1 14.07 13.64 14.61 13.5 14.77C13.36 14.94 13.21 14.96 12.97 14.83C12.72 14.71 11.93 14.45 10.99 13.61C10.26 12.95 9.77 12.14 9.63 11.89C9.48 11.64 9.61 11.51 9.74 11.38C9.85 11.27 9.98 11.1 10.1 10.95C10.22 10.81 10.26 10.7 10.34 10.54C10.42 10.37 10.38 10.23 10.32 10.1C10.26 9.98 9.77 8.78 9.57 8.28C9.37 7.8 9.17 7.86 9.02 7.85C8.88 7.85 8.71 7.85 8.55 7.85C8.39 7.85 8.12 7.91 7.9 8.16C7.67 8.4 7.04 8.98 7.04 10.16C7.04 11.34 7.94 12.48 8.06 12.65C8.18 12.82 9.77 15.35 12.28 16.41C12.88 16.66 13.35 16.81 13.71 16.92C14.31 17.11 14.86 17.08 15.29 17.01C15.78 16.93 16.8 16.39 17.01 15.79C17.22 15.19 17.22 14.67 17.16 14.56C17.09 14.44 16.93 14.38 16.68 14.25" />
              </svg>
              {pageConfig.heroCtaText}
            </Link>
            <a href="#servicios" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: 14 }}>
              Ver servicios
            </a>
          </div>
        </div>

        {/* ───── SERVICIOS ───── */}
        {serviciosDB.length > 0 && (
          <section id="servicios" style={{ width: '100%', maxWidth: 1000, margin: '0 auto 6rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Servicios Destacados</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>Todo lo que podemos hacer por vos</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {serviciosDB.map((s) => (
                <div key={s.id} className="card-glass card-hover" style={{ overflow: 'hidden', padding: 0 }}>
                  <div style={{ height: 200, background: s.imagen_url ? `url(${s.imagen_url}) center/cover` : 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.15))' }} />
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{s.nombre}</h3>
                    {s.descripcion && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>{s.descripcion}</p>}
                    <Link
                      href={`https://wa.me/${pageConfig.whatsappNumber}?text=Hola! Quiero info sobre ${encodeURIComponent(s.nombre)}`}
                      target="_blank"
                      className="btn-secondary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Consultar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ───── RESERVA DE TURNO ───── */}
        <ReservaSection servicios={serviciosDB} />

        {/* ───── CURSOS / PRODUCTOS ───── */}
        {cursosDB.length > 0 && (
          <section id="cursos" style={{ width: '100%', maxWidth: 1000, margin: '0 auto 6rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Cursos y Productos</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>Aprendé desde donde estés o descargá material exclusivo</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {cursosDB.map((c) => {
                const waMsg = c.mensaje_whatsapp || `Hola! Quiero info sobre ${c.nombre}`
                const icon = TIPO_ICONS[c.tipo || 'servicio'] || '📦'
                return (
                  <div key={c.id} className="card-glass card-hover" style={{ overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
                    {c.imagen_url ? (
                      <div style={{ height: 180, background: `url(${c.imagen_url}) center/cover`, flexShrink: 0 }} />
                    ) : (
                      <div style={{ height: 100, background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', flexShrink: 0 }}>
                        {icon}
                      </div>
                    )}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 9999, background: 'rgba(168,85,247,0.15)', color: '#c084fc', fontSize: '0.75rem', fontWeight: 600 }}>
                          {icon} {c.tipo?.charAt(0).toUpperCase() + (c.tipo?.slice(1) || '')}
                        </span>
                        {c.duracion_horas && (
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: 9999, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                            ⏱ {c.duracion_horas}h
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>{c.nombre}</h3>
                      {c.descripcion && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.5 }}>{c.descripcion}</p>}
                      <div style={{ marginTop: 'auto' }}>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f472b6', marginBottom: '1rem' }}>
                          ${c.precio.toLocaleString('es-AR')}
                        </p>
                        {c.modo_venta === 'link_externo' && c.link_externo ? (
                          <Link href={c.link_externo} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            🛒 Comprar ahora
                          </Link>
                        ) : (
                          <Link
                            href={`https://wa.me/${pageConfig.whatsappNumber}?text=${encodeURIComponent(waMsg)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                          >
                            💬 {c.modo_venta === 'mensaje' ? 'Consultar' : 'Quiero este curso'}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ───── SOBRE MÍ ───── */}
        {(pageConfig.sobreMiTexto || pageConfig.sobreMiImg) && (
          <section id="sobre-mi" style={{ width: '100%', maxWidth: 800, margin: '0 auto 6rem', textAlign: 'left' }}>
            <div className="card-glass" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              {pageConfig.sobreMiImg && (
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: `url(${pageConfig.sobreMiImg}) center/cover`, border: '3px solid rgba(236,72,153,0.4)', flexShrink: 0 }} />
              )}
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Sobre Mí</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                  {pageConfig.sobreMiTexto}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ───── PORTFOLIO ───── */}
        <section id="galeria" style={{ width: '100%', maxWidth: 1000, margin: '0 auto 6rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Mis Trabajos</h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>Una muestra de los looks que podemos crear juntas</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {portfolio.map((item) => (
              <div key={item.id} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ height: 260, background: `url(${item.imagen_url}) center/cover` }} className="card-hover" />
                {item.descripcion && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', padding: '1rem 0.75rem 0.75rem', color: 'white', fontSize: '0.8rem' }}>
                    {item.descripcion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ───── TESTIMONIOS ───── */}
        {testimonios.length > 0 && (
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
        )}

        {/* ───── CTA FINAL ───── */}
        <section style={{ width: '100%', maxWidth: 700, margin: '0 auto 6rem' }}>
          <div className="card-glass" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>¿Lista para tu transformación?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Reservá tu turno hoy y empezá a sentirte increíble. Respondemos todos los mensajes de forma personalizada.
            </p>
            <Link
              href={`https://wa.me/${pageConfig.whatsappNumber}?text=Hola! Me gustaría reservar un turno`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '1rem 2.5rem', fontSize: '1rem', borderRadius: 14 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM12.04 20.15C10.57 20.15 9.15 19.76 7.9 19.01L7.61 18.84L4.54 19.65L5.36 16.65L5.18 16.35C4.38 15.02 3.96 13.5 3.96 11.91C3.96 7.46 7.59 3.83 12.04 3.83C16.49 3.83 20.12 7.46 20.12 11.91C20.12 16.36 16.49 20.15 12.04 20.15ZM16.49 14.5C16.24 14.38 15.03 13.78 14.81 13.7C14.59 13.62 14.42 13.58 14.26 13.82C14.1 14.07 13.64 14.61 13.5 14.77C13.36 14.94 13.21 14.96 12.97 14.83C12.72 14.71 11.93 14.45 10.99 13.61C10.26 12.95 9.77 12.14 9.63 11.89C9.48 11.64 9.61 11.51 9.74 11.38C9.85 11.27 9.98 11.1 10.1 10.95C10.22 10.81 10.26 10.7 10.34 10.54C10.42 10.37 10.38 10.23 10.32 10.1C10.26 9.98 9.77 8.78 9.57 8.28C9.37 7.8 9.17 7.86 9.02 7.85C8.88 7.85 8.71 7.85 8.55 7.85C8.39 7.85 8.12 7.91 7.9 8.16C7.67 8.4 7.04 8.98 7.04 10.16C7.04 11.34 7.94 12.48 8.06 12.65C8.18 12.82 9.77 15.35 12.28 16.41C12.88 16.66 13.35 16.81 13.71 16.92C14.31 17.11 14.86 17.08 15.29 17.01C15.78 16.93 16.8 16.39 17.01 15.79C17.22 15.19 17.22 14.67 17.16 14.56C17.09 14.44 16.93 14.38 16.68 14.25" />
              </svg>
              Reservar mi turno
            </Link>
          </div>
        </section>
      </main>

      <Footer brandName={pageConfig.brandName} />


    </div>
  )
}
