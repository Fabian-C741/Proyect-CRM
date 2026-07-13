import Link from 'next/link'

type Props = {
  heroTitle: string
  heroSubtitle: string
  heroCtaText: string
  whatsappNumber: string
}

export default function HeroSection({ heroTitle, heroSubtitle, heroCtaText, whatsappNumber }: Props) {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto 5rem', animation: 'authFadeUp 0.6s ease-out forwards' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 1rem', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: 9999, color: '#f472b6', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
        ✨ ESTUDIO DE MAQUILLAJE
      </div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
        {heroTitle}
      </h1>
      <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
        {heroSubtitle}
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: 14 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM12.04 20.15C10.57 20.15 9.15 19.76 7.9 19.01L7.61 18.84L4.54 19.65L5.36 16.65L5.18 16.35C4.38 15.02 3.96 13.5 3.96 11.91C3.96 7.46 7.59 3.83 12.04 3.83C16.49 3.83 20.12 7.46 20.12 11.91C20.12 16.36 16.49 20.15 12.04 20.15ZM16.49 14.5C16.24 14.38 15.03 13.78 14.81 13.7C14.59 13.62 14.42 13.58 14.26 13.82C14.1 14.07 13.64 14.61 13.5 14.77C13.36 14.94 13.21 14.96 12.97 14.83C12.72 14.71 11.93 14.45 10.99 13.61C10.26 12.95 9.77 12.14 9.63 11.89C9.48 11.64 9.61 11.51 9.74 11.38C9.85 11.27 9.98 11.1 10.1 10.95C10.22 10.81 10.26 10.7 10.34 10.54C10.42 10.37 10.38 10.23 10.32 10.1C10.26 9.98 9.77 8.78 9.57 8.28C9.37 7.8 9.17 7.86 9.02 7.85C8.88 7.85 8.71 7.85 8.55 7.85C8.39 7.85 8.12 7.91 7.9 8.16C7.67 8.4 7.04 8.98 7.04 10.16C7.04 11.34 7.94 12.48 8.06 12.65C8.18 12.82 9.77 15.35 12.28 16.41C12.88 16.66 13.35 16.81 13.71 16.92C14.31 17.11 14.86 17.08 15.29 17.01C15.78 16.93 16.8 16.39 17.01 15.79C17.22 15.19 17.22 14.67 17.16 14.56C17.09 14.44 16.93 14.38 16.68 14.25" />
          </svg>
          {heroCtaText}
        </Link>
        <a href="#servicios-productos" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem', borderRadius: 14 }}>
          Ver servicios y productos
        </a>
      </div>
    </div>
  )
}
