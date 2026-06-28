import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/dal/auth'

/**
 * Página raíz — redirige según el estado de autenticación.
 * Server Component: la decisión ocurre en el servidor, sin flicker en el cliente.
 */
export default async function RootPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
