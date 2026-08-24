'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Overlay de modal renderizado con portal directo a <body>.
 * - Garantiza que el modal se ancle a la PANTALLA (viewport), aunque algún
 *   ancestro tenga transform/filter (causa del bug "el modal se abre arriba").
 * - En móvil el panel arranca desde arriba y se scrollea dentro del overlay
 *   (evita el recorte clásico de flexbox al centrar contenido más alto que la pantalla).
 */
export default function ModalOverlay({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 flex items-start sm:items-center justify-center animate-fade-in">
      {children}
    </div>,
    document.body
  )
}
