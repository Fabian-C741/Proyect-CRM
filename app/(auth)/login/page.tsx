import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión — CRM Maquilladora',
}

export default function LoginPage() {
  return (
    <>
      {/* Encabezado de la tarjeta */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          Bienvenida de vuelta 👋
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginTop: 6,
            marginBottom: 0,
            lineHeight: 1.5,
          }}
        >
          Ingresa tus credenciales para acceder al panel
        </p>
      </div>

      {/* Separador */}
      <div
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          marginBottom: '1.75rem',
        }}
      />

      <LoginForm />
    </>
  )
}
