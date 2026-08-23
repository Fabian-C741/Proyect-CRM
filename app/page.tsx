import Navbar from './_components/Navbar'
import Footer from './_components/Footer'
import PortfolioGallery from './_components/PortfolioGallery'
import HeroSection from './_components/sections/HeroSection'
import CategorySection from './_components/sections/CategorySection'
import SobreMiSection from './_components/sections/SobreMiSection'
import TestimoniosSection from './_components/sections/TestimoniosSection'
import CTASection from './_components/sections/CTASection'
import {
  getSiteSettings,
  getProductosPublicos,
  getPortfolioPublico,
  getTestimoniosPublicos,
  getMenuItemsPublicos,
} from '@/lib/dal/landing'
import type { SeccionesLanding } from '@/lib/definitions'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const [settings, productos, portfolio, testimonios, menuItems] = await Promise.all([
    getSiteSettings(),
    getProductosPublicos(),
    getPortfolioPublico(),
    getTestimoniosPublicos(),
    getMenuItemsPublicos(),
  ])

  const pageConfig = {
    brandName:      settings?.brand_name    || 'CRM Maquilladora',
    heroTitle:      settings?.hero_title    || 'Realza tu belleza natural',
    heroSubtitle:   settings?.hero_subtitle || 'Servicios profesionales de maquillaje para eventos, novias y cursos de automaquillaje.',
    heroCtaText:    settings?.hero_cta_text || 'Reserva tu turno',
    whatsappNumber: settings?.whatsapp_number || '5491112345678',
    sobreMiTexto:   settings?.sobre_mi_texto || null,
    sobreMiImg:     settings?.sobre_mi_imagen_url || null,
    ctaTitle:       settings?.cta_title || '¿Lista para tu transformación?',
    ctaText:        settings?.cta_text || 'Reservá tu turno hoy y empezá a sentirte increíble. Respondemos todos los mensajes de forma personalizada.',
    ctaButtonText:  settings?.cta_button_text || 'Reservar mi turno',
  }

  // Agrupar productos por tipo (base + personalizados) y ordenar secciones
  const secciones: SeccionesLanding = settings?.secciones_config || {}
  const grupos = new Map<string, typeof productos>()
  for (const p of productos) {
    const lista = grupos.get(p.tipo) || []
    lista.push(p)
    grupos.set(p.tipo, lista)
  }
  const tiposVisibles = Array.from(grupos.keys())
    .filter(tipo => secciones[tipo]?.visible !== false)
    .sort((a, b) => {
      const oa = secciones[a]?.orden ?? (['servicio', 'curso', 'pdf', 'ebook'].indexOf(a) >= 0 ? ['servicio', 'curso', 'pdf', 'ebook'].indexOf(a) : 100)
      const ob = secciones[b]?.orden ?? (['servicio', 'curso', 'pdf', 'ebook'].indexOf(b) >= 0 ? ['servicio', 'curso', 'pdf', 'ebook'].indexOf(b) : 100)
      return oa - ob
    })

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-surface-bg">
      {/* Blobs decorativos: solo gradiente radial (sin filter blur para evitar
          re-rasterización GPU en móvil que recorta las imágenes al scrollear) */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <Navbar brandName={pageConfig.brandName} menuItems={menuItems} />

      <main className="flex-1 relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-10">
        <HeroSection
          heroTitle={pageConfig.heroTitle}
          heroSubtitle={pageConfig.heroSubtitle}
          heroCtaText={pageConfig.heroCtaText}
          whatsappNumber={pageConfig.whatsappNumber}
        />

        {tiposVisibles.map(tipo => (
          <CategorySection
            key={tipo}
            tipo={tipo}
            items={grupos.get(tipo) || []}
            whatsappNumber={pageConfig.whatsappNumber}
            icono={secciones[tipo]?.icono || undefined}
            titulo={secciones[tipo]?.titulo || undefined}
            descripcion={secciones[tipo]?.descripcion || undefined}
          />
        ))}

        <SobreMiSection texto={pageConfig.sobreMiTexto} imagenUrl={pageConfig.sobreMiImg} />

        {portfolio.length > 0 && (
          <section id="galeria" style={{ width: '100%', maxWidth: 1000, margin: '0 auto 6rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.75rem', textAlign: 'center' }}>Mis Trabajos</h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem' }}>Una muestra de los looks que podemos crear juntas</p>
            <PortfolioGallery items={portfolio} />
          </section>
        )}

        <TestimoniosSection testimonios={testimonios} />

        <CTASection
          ctaTitle={pageConfig.ctaTitle}
          ctaText={pageConfig.ctaText}
          ctaButtonText={pageConfig.ctaButtonText}
          whatsappNumber={pageConfig.whatsappNumber}
        />
      </main>

      <Footer brandName={pageConfig.brandName} />
    </div>
  )
}
