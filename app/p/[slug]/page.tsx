import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/app/_components/Navbar'
import Footer from '@/app/_components/Footer'
import { getPaginaBySlug } from '@/lib/dal/paginas'
import { getMenuItemsPublicos, getSiteSettings } from '@/lib/dal/landing'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pagina = await getPaginaBySlug(slug)
  return {
    title: pagina?.titulo || 'Página no encontrada',
    robots: { index: false, follow: false },
  }
}

export default async function PaginaDinamica({ params }: Props) {
  const { slug } = await params
  const [pagina, settings, menuItems] = await Promise.all([
    getPaginaBySlug(slug),
    getSiteSettings(),
    getMenuItemsPublicos(),
  ])

  if (!pagina) notFound()

  const brandName = settings?.brand_name || 'CRM Maquilladora'

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-surface-bg">
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <Navbar brandName={brandName} menuItems={menuItems} />

      <main className="flex-1 relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-16" style={{ width: '100%' }}>
        <article
          className="card-glass"
          style={{ maxWidth: 760, width: '100%', padding: 'clamp(1.5rem, 5vw, 3rem)', textAlign: 'left', borderRadius: '1.25rem' }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
            {pagina.titulo}
          </h1>
          <div style={{ height: 2, width: 64, background: 'linear-gradient(90deg, #ec4899, #a855f7)', borderRadius: 2, marginBottom: '1.75rem' }} />

          {Array.isArray(pagina.bloques) && pagina.bloques.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {pagina.bloques.map((b, i) => {
                if (b.tipo === 'titulo') {
                  return (
                    <h2 key={i} style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.75rem 0 0', lineHeight: 1.3 }}>
                      {b.texto}
                    </h2>
                  )
                }
                if (b.tipo === 'texto') {
                  return (
                    <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {b.texto}
                    </p>
                  )
                }
                return (
                  <figure key={i} style={{ margin: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.url}
                      alt={b.descripcion || ''}
                      loading="lazy"
                      style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 12, display: 'block' }}
                    />
                    {b.descripcion && (
                      <figcaption style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center' }}>
                        {b.descripcion}
                      </figcaption>
                    )}
                  </figure>
                )
              })}
            </div>
          ) : pagina.contenido ? (
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap', margin: 0 }}>
              {pagina.contenido}
            </p>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
              Esta página todavía no tiene contenido.
            </p>
          )}

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Link href="/" className="btn-secondary" style={{ fontSize: '0.875rem' }}>
              ← Volver al inicio
            </Link>
          </div>
        </article>
      </main>

      <Footer brandName={brandName} />
    </div>
  )
}
