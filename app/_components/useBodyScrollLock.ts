'use client'

import { useEffect } from 'react'

/**
 * Bloquea el scroll del body mientras `locked` sea true.
 * Evita que la página de fondo scrollee detrás de modales/menús móviles
 * (causa de imágenes "cortadas" y saltos visuales en móvil).
 */
export default function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}
