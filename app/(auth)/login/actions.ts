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
  console.log('LoginAction: Obteniendo cliente Supabase...')
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('LoginAction: Variables configuradas:', {
    hasUrl: !!supabaseUrl,
    urlValue: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'VACIO',
    hasKey: !!supabaseAnonKey
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('LoginAction: Error - Faltan variables de entorno en el servidor')
    return { message: 'Error de configuración del servidor. Faltan credenciales.' }
  }

  const supabase = await createSupabaseServerClient()
  console.log('LoginAction: Intentando autenticar en Supabase para:', email)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error('LoginAction: Supabase rechazó las credenciales:', error.message)
      return {
        message: 'Email o contraseña incorrectos. Intenta nuevamente.',
      }
    }

    console.log('LoginAction: Autenticación exitosa en Supabase. User:', data.user?.id)
    console.log('LoginAction: Ejecutando redirect("/dashboard")...')
    redirect('/dashboard')
  } catch (err: any) {
    // Si es un error de redirect de Next.js, debemos relanzarlo
    if (err && err.digest && err.digest.startsWith('NEXT_REDIRECT')) {
      console.log('LoginAction: Catching NEXT_REDIRECT (flujo normal de Next.js). Relanzando...')
      throw err
    }
    console.error('LoginAction: Excepción inesperada durante el login:', err)
    return {
      message: 'Ocurrió un error inesperado al iniciar sesión.',
    }
  }
}
