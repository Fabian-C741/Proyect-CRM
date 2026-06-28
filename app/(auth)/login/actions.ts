'use server'

import { redirect } from 'next/navigation'
import { LoginSchema } from '@/lib/definitions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { FormState } from '@/lib/definitions'

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Validar inputs con Zod (server-side)
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { email, password } = result.data

  // 2. Autenticar con Supabase
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Mensaje genérico — no revelar si el email existe o no
    return {
      message: 'Email o contraseña incorrectos. Intenta nuevamente.',
    }
  }

  // 3. Redirigir al dashboard (cookie de sesión ya guardada por Supabase)
  redirect('/dashboard')
}
