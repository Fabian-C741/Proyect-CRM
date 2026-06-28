'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import type { FormState } from '@/lib/definitions'

const initialState: FormState = undefined

export default function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, initialState)

  return (
    <form action={action} noValidate>
      {/* Error general */}
      {state?.message && (
        <div
          role="alert"
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 10,
            padding: '0.75rem 1rem',
            marginBottom: 20,
            color: '#f87171',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {state.message}
        </div>
      )}

      {/* Campo Email */}
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: 6,
          }}
        >
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@email.com"
          className="input-base"
          aria-describedby={state?.errors?.email ? 'email-error' : undefined}
          aria-invalid={!!state?.errors?.email}
        />
        {state?.errors?.email && (
          <p id="email-error" style={{ color: '#f87171', fontSize: '0.8125rem', marginTop: 4 }}>
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div style={{ marginBottom: 28 }}>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: 6,
          }}
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="input-base"
          aria-describedby={state?.errors?.password ? 'password-error' : undefined}
          aria-invalid={!!state?.errors?.password}
        />
        {state?.errors?.password && (
          <p id="password-error" style={{ color: '#f87171', fontSize: '0.8125rem', marginTop: 4 }}>
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* Botón submit */}
      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
        id="login-submit-btn"
      >
        {isPending ? (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Ingresando...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
            </svg>
            Ingresar al panel
          </>
        )}
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  )
}
