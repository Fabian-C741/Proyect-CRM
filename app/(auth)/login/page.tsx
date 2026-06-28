import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
}

export default function LoginPage() {
  return (
    <>
      <h2
        style={{
          fontSize: '1.375rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        Bienvenida de vuelta
      </h2>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          textAlign: 'center',
          marginBottom: 28,
        }}
      >
        Ingresa tus credenciales para acceder al panel
      </p>
      <LoginForm />
    </>
  )
}
