import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCliente } from '@/lib/dal/clientes'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'
import type { Agenda } from '@/lib/definitions'
import ClienteDetailClient from './ClienteDetailClient'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getClienteCitas(clienteId: string): Promise<Agenda[]> {
  try {
    const user = await getCurrentUser()
    if (!user) return []

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('agenda')
      .select(`
        id, user_id, cliente_id, curso_id, fecha, estado, notas, created_at,
        cursos (id, nombre, precio)
      `)
      .eq('cliente_id', clienteId)
      .eq('user_id', user.id)
      .order('fecha', { ascending: false })

    if (error) return []
    return (data ?? []) as unknown as Agenda[]
  } catch {
    return []
  }
}

export default async function ClienteDetailPage({ params }: PageProps) {
  // En Next.js 15, params es una Promise — debemos awaitearlo
  const { id } = await params

  const [cliente, citas] = await Promise.all([
    getCliente(id),
    getClienteCitas(id),
  ])

  if (!cliente) {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/dashboard/clientes" className="hover:text-slate-200 transition-colors">
          Clientes
        </Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-white font-medium">{cliente.nombre}</span>
      </nav>

      <ClienteDetailClient cliente={cliente} citas={citas} />
    </div>
  )
}
