'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Topbar({ userNombre }: { userNombre: string }) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-surface-950/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span>Hola,</span>
        <span className="font-medium text-slate-200">{userNombre}</span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-pink-500 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Cerrar sesión
      </button>
    </header>
  )
}
