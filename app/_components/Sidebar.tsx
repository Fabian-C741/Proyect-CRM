'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import InstallPWA from './InstallPWA'

type Props = {
  brandName?: string
  navItems: { name: string; href: string; icon: string }[]
}

export default function Sidebar({ brandName = 'CRM Beauty', navItems }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const sidebarContent = (
    <div className={`flex flex-col h-full ${open ? '' : ''}`}>
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <span className="font-bold text-white tracking-wide">{brandName}</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || ((pathname || '').startsWith(item.href) && item.href !== '/dashboard')
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-pink-500/10 text-pink-500' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isActive ? 'text-pink-500' : 'text-slate-500'}>
                <path d={item.icon} />
              </svg>
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4">
        <InstallPWA />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 flex-shrink-0 bg-surface-900 border-r border-white/5 flex-col h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-surface-800 border border-white/10 flex items-center justify-center text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)}>
          <div className="w-64 h-full bg-surface-900 border-r border-white/5 overflow-y-auto" onClick={e => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
