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
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12,
            padding: '0.875rem 1rem',
            marginBottom: 24,
            color: '#f87171',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            lineHeight: 1.5,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ flexShrink: 0, marginTop: 1 }}
          >
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
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          Correo electrónico
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="tu@email.com"
            className="input-base"
            style={{
              paddingLeft: '1rem',
              paddingRight: '1rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              fontSize: '0.9375rem',
            }}
            aria-describedby={state?.errors?.email ? 'email-error' : undefined}
            aria-invalid={!!state?.errors?.email}
          />
        </div>
        {state?.errors?.email && (
          <p
            id="email-error"
            style={{
              color: '#f87171',
              fontSize: '0.8125rem',
              marginTop: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {state.errors.email[0]}
          </p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div style={{ marginBottom: 32 }}>
        <label
          htmlFor="password"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7 }}>
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
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
          style={{
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            fontSize: '1rem',
            letterSpacing: '0.15em',
          }}
          aria-describedby={state?.errors?.password ? 'password-error' : undefined}
          aria-invalid={!!state?.errors?.password}
        />
        {state?.errors?.password && (
          <p
            id="password-error"
            style={{ color: '#f87171', fontSize: '0.8125rem', marginTop: 6 }}
          >
            {state.errors.password[0]}
          </p>
        )}
      </div>

      {/* Botón submit */}
      <button
        type="submit"
        disabled={isPending}
        id="login-submit-btn"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.625rem',
          padding: '0.875rem 1.5rem',
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: 'white',
          background: isPending
            ? 'rgba(236,72,153,0.5)'
            : 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
          borderRadius: 12,
          border: 'none',
          cursor: isPending ? 'not-allowed' : 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: isPending
            ? 'none'
            : '0 4px 20px rgba(236, 72, 153, 0.4), 0 1px 0 rgba(255,255,255,0.15) inset',
          letterSpacing: '-0.01em',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-btn"
      >
        {isPending ? (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Ingresando...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
            </svg>
            Ingresar al panel
          </>
        )}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .login-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(236, 72, 153, 0.5), 0 1px 0 rgba(255,255,255,0.15) inset !important;
        }
        .login-btn:not(:disabled):active {
          transform: translateY(0px);
          box-shadow: 0 2px 10px rgba(236, 72, 153, 0.3) !important;
        }
      `}</style>
    </form>
  )
}
