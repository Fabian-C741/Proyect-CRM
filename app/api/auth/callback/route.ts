import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Callback para el flujo OAuth de Supabase.
 * Supabase redirige aquí después de una autenticación exitosa con Magic Link o Google.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // En caso de error, redirigir al login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
