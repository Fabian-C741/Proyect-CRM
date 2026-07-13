import 'server-only'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export type DiagnosticResult = {
  label: string
  status: 'ok' | 'error' | 'warning' | 'info'
  detail: string
  data?: unknown
}

export async function runDiagnostics(): Promise<{
  timestamp: string
  results: DiagnosticResult[]
}> {
  const results: DiagnosticResult[] = []

  // 1. ENV vars
  results.push({
    label: 'Variables de entorno',
    status: process.env.SUPABASE_URL ? 'ok' : 'error',
    detail: `SUPABASE_URL: ${process.env.SUPABASE_URL ? '✓ configurada' : '✗ faltante'}
SUPABASE_ANON_KEY: ${(process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ? '✓ configurada' : '✗ faltante'}
SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ configurada' : '✗ faltante'}`,
  })

  // 2. Admin client connection
  try {
    const admin = getSupabaseAdmin()
    const { error } = await admin.from('cursos').select('count', { count: 'exact', head: true })
    results.push({
      label: 'Conexión Admin (service_role)',
      status: error ? 'error' : 'ok',
      detail: error ? `Error: ${error.message} (${error.code})` : 'Conexión exitosa',
    })
  } catch (e: any) {
    results.push({
      label: 'Conexión Admin (service_role)',
      status: 'error',
      detail: `Excepción: ${e.message}`,
    })
  }

  // 3. Anon client connection (simula landing page)
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.from('cursos').select('count', { count: 'exact', head: true })
    results.push({
      label: 'Conexión Anon (pública, simula landing)',
      status: error ? 'error' : 'ok',
      detail: error ? `Error: ${error.message} (${error.code})` : 'Conexión exitosa',
      data: error ? undefined : { total_registros: data },
    })
  } catch (e: any) {
    results.push({
      label: 'Conexión Anon (pública)',
      status: 'error',
      detail: `Excepción: ${e.message}`,
    })
  }

  // 4. Schema de la tabla cursos
  try {
    const admin = getSupabaseAdmin()
    const { data: sample } = await admin.from('cursos').select('*').limit(1)
    if (sample && sample.length > 0) {
      const colNames = Object.keys(sample[0])
      const expected = ['id', 'user_id', 'nombre', 'descripcion', 'precio', 'duracion_horas', 'activo', 'imagen_url', 'tipo', 'modo_venta', 'link_externo', 'mensaje_whatsapp', 'mostrar_en_landing', 'orden', 'created_at']
      const missing = expected.filter(c => !colNames.includes(c))
      results.push({
        label: 'Estructura tabla cursos',
        status: missing.length === 0 ? 'ok' : 'error',
        detail: `Columnas encontradas: ${colNames.length}/15
${missing.length > 0 ? `FALTAN: ${missing.join(', ')}` : 'Todas las columnas OK'}
Columnas: ${colNames.join(', ')}`,
      })
    } else {
      results.push({
        label: 'Estructura tabla cursos',
        status: 'warning',
        detail: 'Tabla sin datos. No se puede verificar estructura completa.',
      })
    }
  } catch (e: any) {
    results.push({
      label: 'Estructura tabla cursos',
      status: 'error',
      detail: `Error al leer estructura: ${e.message}`,
    })
  }

  // 5. Consulta pública (anon) simulando getProductosPublicos
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    const filtered = (data as any[] | null)?.filter(c => c.mostrar_en_landing !== false) ?? []

    results.push({
      label: 'getProductosPublicos() — query real',
      status: error ? 'error' : filtered.length > 0 ? 'ok' : 'warning',
      detail: error
        ? `Error: ${error.message} (${error.code})`
        : `Registros activos: ${data?.length ?? 0}
Registros con mostrar_en_landing != false: ${filtered.length}
${filtered.length === 0 ? '⚠️ Consulta OK pero sin datos para mostrar en landing' : '✅ Datos disponibles'}`,
      data: error ? undefined : { total_activos: data?.length ?? 0, visibles_en_landing: filtered.length, muestra: filtered.slice(0, 3) },
    })
  } catch (e: any) {
    results.push({
      label: 'getProductosPublicos()',
      status: 'error',
      detail: `Excepción: ${e.message}`,
    })
  }

  // 6. Consulta Admin (todos los registros sin filtro)
  try {
    const admin = getSupabaseAdmin()
    const { data, error } = await admin.from('cursos').select('*').order('created_at', { ascending: false })

    results.push({
      label: 'Consulta Admin (todos los cursos, sin filtros)',
      status: error ? 'error' : 'ok',
      detail: error
        ? `Error: ${error.message} (${error.code})`
        : `Total registros en DB: ${data?.length ?? 0}
${(data ?? []).map((c: any) => `  • ${c.nombre} | activo=${c.activo} | mostrar_en_landing=${c.mostrar_en_landing} | tipo=${c.tipo}`).join('\n')}`,
      data: error ? undefined : { total: data?.length ?? 0, registros: data },
    })
  } catch (e: any) {
    results.push({
      label: 'Consulta Admin (todos los cursos)',
      status: 'error',
      detail: `Excepción: ${e.message}`,
    })
  }

  return { timestamp: new Date().toISOString(), results }
}
