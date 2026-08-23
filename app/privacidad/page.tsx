import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import Footer from '@/app/_components/Footer'
import { getSiteSettings, getMenuItemsPublicos } from '@/lib/dal/landing'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Política de Privacidad',
  robots: { index: false, follow: false },
}

export default async function PrivacidadPage() {
  const [settings, menuItems] = await Promise.all([
    getSiteSettings(),
    getMenuItemsPublicos(),
  ])

  const brandName = settings?.brand_name || 'CRM Maquilladora'

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-surface-bg">
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <Navbar brandName={brandName} menuItems={menuItems} />

      <main className="flex-1 relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-16" style={{ width: '100%' }}>
        <article
          className="card-glass"
          style={{ maxWidth: 820, width: '100%', padding: 'clamp(1.5rem, 5vw, 3rem)', textAlign: 'left', borderRadius: '1.25rem' }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
            Política de Privacidad
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div style={{ height: 2, width: 64, background: 'linear-gradient(90deg, #ec4899, #a855f7)', borderRadius: 2, marginBottom: '1.75rem' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.975rem' }}>
            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>1. Responsable del tratamiento</h2>
              <p style={{ margin: 0 }}>
                Los datos personales que se recopilan a través de este sitio son responsabilidad de <b>{brandName}</b>,
                quien actúa como responsable del tratamiento de la información de sus clientes y visitantes.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>2. Datos que recopilamos</h2>
              <p style={{ margin: '0 0 0.5rem' }}>Podemos recopilar la siguiente información cuando usás el sitio:</p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                <li>Datos de contacto: nombre, número de teléfono o WhatsApp.</li>
                <li>Datos de la reserva: fecha, servicio solicitado y cualquier detalle que nos compartas.</li>
                <li>Testimonios o comentarios que decidas enviar voluntariamente.</li>
                <li>Datos de navegación no identificables (mediante cookies técnicas).</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>3. Finalidad del tratamiento</h2>
              <p style={{ margin: 0 }}>
                Utilizamos tus datos exclusivamente para gestionar turnos y reservas, contactarte sobre tu solicitud,
                brindarte información sobre nuestros servicios y mejorar la atención. No los usamos para fines publicitarios
                ajenos ni los compartimos con terceros salvo obligación legal.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>4. Base legal y consentimiento</h2>
              <p style={{ margin: 0 }}>
                El tratamiento se basa en tu consentimiento y en la ejecución de la reserva solicitada. Al enviarnos tus datos
                a través de los formularios o canales de contacto, aceptás esta política de privacidad.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>5. Conservación</h2>
              <p style={{ margin: 0 }}>
                Conservamos tus datos solo durante el tiempo necesario para cumplir con la finalidad descrita y las obligaciones
                legales aplicables. Podés solicitar su eliminación en cualquier momento.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>6. Tus derechos</h2>
              <p style={{ margin: '0 0 0.5rem' }}>
                Podés ejercer tus derechos de acceso, rectificación, actualización, cancelación y oposición (derechos ARCO)
                sobre tus datos personales en cualquier momento.
              </p>
              <p style={{ margin: 0 }}>
                Para hacerlo, escribinos por WhatsApp o al correo de contacto del estudio. Atenderemos tu solicitud a la brevedad.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>7. Comunicaciones por WhatsApp</h2>
              <p style={{ margin: 0 }}>
                Las conversaciones que inicies por WhatsApp se utilizan únicamente para coordinar el servicio. La plataforma
                de WhatsApp tiene su propia política de privacidad, independiente de este sitio.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>8. Cambios en esta política</h2>
              <p style={{ margin: 0 }}>
                Podemos actualizar esta política ocasionalmente. La versión vigente será siempre la publicada en esta página.
              </p>
            </section>
          </div>

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
