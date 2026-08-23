'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'
import type { PaginaBloque } from '@/lib/definitions'

// ─────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────
export async function saveSiteSettingsAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const payload = {
    user_id: user.id,
    brand_name: (formData.get('brand_name') as string) || 'Mi Estudio',
    hero_title: (formData.get('hero_title') as string) || 'Realza tu belleza natural',
    hero_subtitle: (formData.get('hero_subtitle') as string) || null,
    hero_cta_text: (formData.get('hero_cta_text') as string) || 'Reserva tu turno',
    whatsapp_number: (formData.get('whatsapp_number') as string) || null,
    sobre_mi_texto: (formData.get('sobre_mi_texto') as string) || null,
    sobre_mi_imagen_url: (formData.get('sobre_mi_imagen_url') as string) || null,
    updated_at: new Date().toISOString(),
  }

  const supabase = await createSupabaseServerClient()

  // Primero ver si ya existe un registro para este usuario
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  let error
  if (existing) {
    // Actualizar registro existente
    const { error: updateError } = await supabase
      .from('site_settings')
      .update(payload)
      .eq('id', existing.id)
    error = updateError
  } else {
    // Insertar nuevo
    const { error: insertError } = await supabase
      .from('site_settings')
      .insert(payload)
    error = insertError
  }

  if (error) return { error: 'Error al guardar: ' + error.message }

  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// SECCIONES LANDING (ícono/título/desc/visibilidad)
// ─────────────────────────────────────────────
const KEY_VALIDO = /^[a-z0-9_]{1,30}$/

function sanitizeSecciones(raw: unknown): Record<string, {
  visible: boolean
  icono: string
  titulo: string
  descripcion: string
  orden: number
  personalizada: boolean
}> | null {
  if (!raw || typeof raw !== 'object') return null
  const entrada = raw as Record<string, unknown>
  const salida: Record<string, { visible: boolean; icono: string; titulo: string; descripcion: string; orden: number; personalizada: boolean }> = {}
  for (const [tipo, s] of Object.entries(entrada)) {
    if (!KEY_VALIDO.test(tipo)) continue
    if (!s || typeof s !== 'object') continue
    const o = s as Record<string, unknown>
    salida[tipo] = {
      visible: o.visible !== false,
      icono: typeof o.icono === 'string' ? o.icono.trim().slice(0, 8) : '',
      titulo: typeof o.titulo === 'string' ? o.titulo.trim().slice(0, 120) : '',
      descripcion: typeof o.descripcion === 'string' ? o.descripcion.trim().slice(0, 400) : '',
      orden: typeof o.orden === 'number' && Number.isFinite(o.orden) ? Math.trunc(o.orden) : 100,
      personalizada: o.personalizada === true,
    }
  }
  return salida
}

export async function saveSeccionesAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  let parsed: unknown
  try {
    parsed = JSON.parse((formData.get('secciones') as string) || '{}')
  } catch {
    return { error: 'Datos inválidos' }
  }

  const secciones = sanitizeSecciones(parsed)
  if (!secciones) return { error: 'Datos inválidos' }

  const supabase = await createSupabaseServerClient()

  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  let error
  if (existing) {
    const res = await supabase
      .from('site_settings')
      .update({ secciones_config: secciones, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    error = res.error
  } else {
    const res = await supabase
      .from('site_settings')
      .insert({ user_id: user.id, secciones_config: secciones })
    error = res.error
  }

  if (error) {
    console.error('[saveSeccionesAction] error:', error.message, error.code, error.details, error.hint)
    const columnaFalta =
      error.code === 'PGRST204' ||
      (error.message || '').toLowerCase().includes('secciones_config')
    if (columnaFalta) {
      return { error: '⚠️ Falta la migración en Supabase: abrí el archivo supabase_migration_secciones_landing.sql y ejecutalo en SQL Editor. Después volvé a intentar guardar.' }
    }
    return { error: 'Error al guardar: ' + error.message }
  }

  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// PORTFOLIO
// ─────────────────────────────────────────────
export async function addPortfolioItemAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  let imagen_url = (formData.get('imagen_url') as string) || ''
  if (!imagen_url) return { error: 'Seleccioná una imagen o pegá una URL' }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const payload = {
    user_id: user.id,
    imagen_url,
    descripcion: (formData.get('descripcion') as string) || null,
    boton_texto: (formData.get('boton_texto') as string) || null,
    boton_enlace: (formData.get('boton_enlace') as string) || null,
    orden: 0,
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    return { error: 'Error al agregar: ' + text }
  }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

async function restFetch(path: string, method: string, body?: any) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const res = await fetch(`${supabaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text)
  }
  return res
}

export async function updatePortfolioItemAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const imagen_url = (formData.get('imagen_url') as string) || ''

  const body: any = {
    descripcion: (formData.get('descripcion') as string) || null,
    boton_texto: (formData.get('boton_texto') as string) || null,
    boton_enlace: (formData.get('boton_enlace') as string) || null,
    orden: parseInt((formData.get('orden') as string) || '0') || 0,
  }
  if (imagen_url) body.imagen_url = imagen_url

  try {
    await restFetch(`/rest/v1/portfolio?id=eq.${id}&user_id=eq.${user.id}`, 'PATCH', body)
  } catch (e: any) {
    return { error: 'Error al actualizar: ' + (e?.message || String(e)) }
  }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function deletePortfolioItemAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  try {
    await restFetch(`/rest/v1/portfolio?id=eq.${id}&user_id=eq.${user.id}`, 'DELETE')
  } catch (e: any) {
    return { error: 'Error al eliminar: ' + (e?.message || String(e)) }
  }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// TESTIMONIOS
// ─────────────────────────────────────────────
export async function createTestimonioAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const nombre_cliente = formData.get('nombre_cliente') as string
  const texto = formData.get('texto') as string
  if (!nombre_cliente || !texto) return { error: 'Nombre y texto son obligatorios' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('testimonios').insert({
    user_id: user.id,
    nombre_cliente,
    texto,
    estrellas: parseInt((formData.get('estrellas') as string) || '5') || 5,
    activo: true,
  })

  if (error) return { error: 'Error al crear: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function deleteTestimonioAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('testimonios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// MENU ITEMS
// ─────────────────────────────────────────────
export async function createMenuItemAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const label = formData.get('label') as string
  if (!label) return { error: 'La etiqueta del menú es obligatoria' }

  const rawHref = formData.get('href') as string
  const parent_id = (formData.get('parent_id') as string) || null

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('menu_items').insert({
    user_id: user.id,
    label: label.trim(),
    href: rawHref?.trim() || null,
    parent_id: parent_id || null,
    orden: parseInt((formData.get('orden') as string) || '0') || 0,
    activo: true,
  })

  if (error) return { error: 'Error al crear elemento de menú: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function updateMenuItemAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const label = formData.get('label') as string
  if (!label) return { error: 'La etiqueta es obligatoria' }

  const rawHref = formData.get('href') as string
  const parent_id = (formData.get('parent_id') as string) || null

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('menu_items')
    .update({
      label: label.trim(),
      href: rawHref?.trim() || null,
      parent_id: parent_id || null,
      orden: parseInt((formData.get('orden') as string) || '0') || 0,
      activo: formData.get('activo') === 'true',
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al actualizar elemento de menú: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// PÁGINAS PERSONALIZADAS (/p/slug)
// ─────────────────────────────────────────────
function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

type BloqueRaw = { tipo?: unknown; texto?: unknown; url?: unknown; descripcion?: unknown }

function parseBloques(raw: FormDataEntryValue | null): PaginaBloque[] {
  if (!raw || typeof raw !== 'string') return []
  try {
    const arr: unknown = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    const out: PaginaBloque[] = []
    for (const b of (arr as BloqueRaw[]).slice(0, 100)) {
      if (!b || typeof b !== 'object') continue
      if ((b.tipo === 'titulo' || b.tipo === 'texto')) {
        const texto = String(b.texto ?? '').slice(0, 5000)
        if (!texto.trim()) continue
        out.push({ tipo: b.tipo, texto })
      } else if (b.tipo === 'imagen') {
        const url = String(b.url ?? '').slice(0, 1000)
        if (!url) continue
        const descripcion = b.descripcion ? String(b.descripcion).slice(0, 300) : undefined
        out.push(descripcion ? { tipo: 'imagen', url, descripcion } : { tipo: 'imagen', url })
      }
    }
    return out
  } catch {
    return []
  }
}

function imagenesDesdeBloques(bloques: unknown): string[] {
  if (!Array.isArray(bloques)) return []
  return bloques
    .filter((b: any) => b && b.tipo === 'imagen' && typeof b.url === 'string' && b.url)
    .map((b: any) => b.url as string)
}

function pathDesdeUrlPublica(url: string): string | null {
  const marker = '/public/servicios/'
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

async function borrarImagenesStorage(urls: string[]) {
  const paths = urls
    .map(pathDesdeUrlPublica)
    .filter((p): p is string => typeof p === 'string' && p.length > 0)
  if (paths.length === 0) return
  for (const path of paths) {
    try {
      await restFetch(`/storage/v1/object/servicios/${path}`, 'DELETE')
    } catch (e) {
      console.error('[borrarImagenesStorage] no se pudo borrar', path, e)
    }
  }
}

export async function createPaginaAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const titulo = ((formData.get('titulo') as string) || '').trim()
  if (!titulo) return { error: 'El título es obligatorio' }
  const contenido = ((formData.get('contenido') as string) || '').trim() || null

  const supabase = await createSupabaseServerClient()

  // Slug único por usuario
  const base = slugify(titulo) || 'pagina'
  let slug = base
  for (let i = 2; i < 50; i++) {
    const { data: existing } = await supabase
      .from('paginas')
      .select('id')
      .eq('user_id', user.id)
      .eq('slug', slug)
      .maybeSingle()
    if (!existing) break
    slug = `${base}-${i}`
  }

  const { error } = await supabase.from('paginas').insert({
    user_id: user.id,
    slug,
    titulo,
    contenido,
    bloques: parseBloques(formData.get('bloques')),
    activo: true,
  })
  if (error) {
    console.error('[createPaginaAction] error:', error.message, error.code, error.details, error.hint)
    const tablaFalta = (error.message || '').toLowerCase().includes('paginas') || error.code === 'PGRST204' || error.code === '42P01'
    if (tablaFalta) {
      return { error: '⚠️ Falta la migración en Supabase: ejecutá el archivo supabase_migration_paginas.sql en SQL Editor y volvé a intentar.' }
    }
    return { error: 'Error al crear la página: ' + error.message }
  }

  // Enlazar automáticamente en el menú superior
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('orden')
    .eq('user_id', user.id)
    .order('orden', { ascending: false })
    .limit(1)
  const orden = ((menuItems?.[0]?.orden as number) ?? 0) + 1

  await supabase.from('menu_items').insert({
    user_id: user.id,
    label: titulo,
    href: `/p/${slug}`,
    orden,
    activo: true,
    parent_id: null,
  })

  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true, slug }
}

export async function updatePaginaAction(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const titulo = ((formData.get('titulo') as string) || '').trim()
  if (!titulo) return { error: 'El título es obligatorio' }
  const contenido = ((formData.get('contenido') as string) || '').trim() || null
  const activo = formData.get('activo') !== null ? formData.get('activo') === 'true' : undefined

  const supabase = await createSupabaseServerClient()

  // Imágenes previas para detectar las que se quitaron y borrarlas del Storage
  const { data: existente } = await supabase
    .from('paginas')
    .select('bloques')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()
  const urlsPrevias = imagenesDesdeBloques(existente?.bloques)

  const payload: Record<string, unknown> = { titulo, contenido }
  const bloques = formData.get('bloques')
  if (bloques !== null) payload.bloques = parseBloques(bloques)
  if (activo !== undefined) payload.activo = activo

  const { data: actualizada } = await supabase
    .from('paginas')
    .update(payload)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('slug')
    .maybeSingle()

  if (!actualizada) return { error: 'No se pudo actualizar la página' }

  // Borrar del Storage las imágenes que ya no están en la página
  const urlsNuevas = imagenesDesdeBloques(payload.bloques)
  const quitadas = urlsPrevias.filter(u => !urlsNuevas.includes(u))
  if (quitadas.length) await borrarImagenesStorage(quitadas)

  // Mantener sincronizada la etiqueta del menú
  await supabase
    .from('menu_items')
    .update({ label: titulo })
    .eq('user_id', user.id)
    .eq('href', `/p/${actualizada.slug}`)

  revalidatePath('/')
  revalidatePath(`/p/${actualizada.slug}`)
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function deletePaginaAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()

  const { data: pagina } = await supabase
    .from('paginas')
    .select('slug, bloques')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (pagina) {
    // Borrar las imágenes del Storage antes de eliminar la fila
    const urls = imagenesDesdeBloques(pagina.bloques)
    if (urls.length) await borrarImagenesStorage(urls)

    await supabase
      .from('paginas')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (pagina.slug) {
      await supabase
        .from('menu_items')
        .delete()
        .eq('user_id', user.id)
        .eq('href', `/p/${pagina.slug}`)
    }
  }

  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

// ─────────────────────────────────────────────
// BLOQUEOS HORARIOS
// ─────────────────────────────────────────────
export async function crearBloqueoAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const fecha = formData.get('fecha') as string
  if (!fecha) return { error: 'La fecha es obligatoria' }

  const hora_inicio = (formData.get('hora_inicio') as string) || null
  const hora_fin = (formData.get('hora_fin') as string) || null
  const motivo = (formData.get('motivo') as string) || null

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('bloqueos_horarios').insert({
    user_id: user.id,
    fecha,
    hora_inicio,
    hora_fin,
    motivo,
    activo: true,
  })

  if (error) return { error: 'Error al crear bloqueo: ' + error.message }
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function eliminarBloqueoAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('bloqueos_horarios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar bloqueo: ' + error.message }
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

export async function deleteMenuItemAction(id: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'No autorizado' }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: 'Error al eliminar elemento de menú: ' + error.message }
  revalidatePath('/')
  revalidatePath('/dashboard/configuracion')
  return { success: true }
}

