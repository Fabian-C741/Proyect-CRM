'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { MenuItem } from '@/lib/definitions'

type Props = {
  brandName: string
  menuItems: MenuItem[]
}

export default function Navbar({ brandName, menuItems }: Props) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Fallback si no hay elementos guardados en la DB
  const links = menuItems.length > 0 ? menuItems : [
    { id: 'f1', label: 'Servicios', href: '#servicios', parent_id: null },
    { id: 'f2', label: 'Cursos', href: '#cursos', parent_id: null },
    { id: 'f3', label: 'Galería', href: '#galeria', parent_id: null },
    { id: 'f4', label: 'Opiniones', href: '#testimonios', parent_id: null },
    { id: 'f5', label: 'Sobre Mí', href: '#sobre-mi', parent_id: null },
  ] as MenuItem[]

  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 1L9.5 8.5H2L8 13.5L5.5 21L12 16L18.5 21L16 13.5L22 8.5H14.5L12 1Z" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'white' }}>
          {brandName}
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'none', gap: '2rem', fontSize: '0.9375rem', fontWeight: 500 }} className="md:flex items-center">
        {links.map((item) => {
          const hasChildren = item.children && item.children.length > 0

          if (hasChildren) {
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  style={{
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 0',
                  }}
                  className="hover:text-white transition-colors"
                  aria-expanded={activeDropdown === item.id}
                >
                  {item.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: activeDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {activeDropdown === item.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(22, 22, 42, 0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 12,
                      padding: '0.5rem',
                      minWidth: '150px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                      animation: 'fadeIn 0.2s ease-out forwards',
                    }}
                  >
                    {item.children?.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href || '#'}
                        style={{
                          color: 'var(--text-secondary)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 8,
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          fontSize: '0.875rem',
                        }}
                        className="hover:bg-white/5 hover:text-white transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          // Enlace directo
          return (
            <Link
              key={item.id}
              href={item.href || '#'}
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.5rem 0' }}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Spacer or CTA (Maintained layout structure) */}
      <div style={{ width: 80 }} className="hidden md:block"></div>
    </header>
  )
}
