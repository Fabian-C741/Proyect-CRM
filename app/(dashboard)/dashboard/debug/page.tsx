import { runDiagnostics } from '@/lib/debug/runner'

export const dynamic = 'force-dynamic'

const STATUS_ICON: Record<string, string> = { ok: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
const STATUS_COLOR: Record<string, string> = {
  ok: 'rgba(34,197,94,0.12)',
  error: 'rgba(239,68,68,0.12)',
  warning: 'rgba(234,179,8,0.12)',
  info: 'rgba(59,130,246,0.12)',
}
const STATUS_TEXT: Record<string, string> = {
  ok: 'rgba(34,197,94,1)',
  error: 'rgba(239,68,68,1)',
  warning: 'rgba(234,179,8,1)',
  info: 'rgba(59,130,246,1)',
}

export default async function DebugPage() {
  const { timestamp, results } = await runDiagnostics()

  const errorCount = results.filter(r => r.status === 'error').length
  const warningCount = results.filter(r => r.status === 'warning').length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">🔍 Diagnóstico del Sistema</h1>
          <p className="text-slate-400 text-sm">
            {errorCount > 0 || warningCount > 0
              ? `Se detectaron ${errorCount} error(es) y ${warningCount} advertencia(s).`
              : 'Todo funciona correctamente.'}
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono">{new Date(timestamp).toLocaleString('es-AR')}</span>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-glass p-4 text-center">
          <div className="text-2xl font-bold text-white">{results.length}</div>
          <div className="text-xs text-slate-400 mt-1">Pruebas</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{results.filter(r => r.status === 'ok').length}</div>
          <div className="text-xs text-slate-400 mt-1">OK</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{warningCount}</div>
          <div className="text-xs text-slate-400 mt-1">Advertencias</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{errorCount}</div>
          <div className="text-xs text-slate-400 mt-1">Errores</div>
        </div>
      </div>

      {/* Resultados detallados */}
      <div className="space-y-3">
        {results.map((r, i) => (
          <div
            key={i}
            className="card-glass"
            style={{ borderLeft: `4px solid ${STATUS_TEXT[r.status]}`, padding: '1rem 1.25rem' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span>{STATUS_ICON[r.status]}</span>
              <span className="font-semibold text-white text-sm">{r.label}</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: STATUS_COLOR[r.status], color: STATUS_TEXT[r.status] }}
              >
                {r.status.toUpperCase()}
              </span>
            </div>
            <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">{r.detail}</pre>
            {'data' in r && r.data !== undefined && (
              <details className="mt-2">
                <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300">Ver datos</summary>
                <pre className="text-xs text-slate-400 font-mono mt-2 bg-black/20 p-3 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(r.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {errorCount === 0 && warningCount === 0 && (
        <div className="card-glass p-8 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-white font-semibold text-lg">Todo funciona correctamente</p>
          <p className="text-slate-400 text-sm mt-1">Esta página de diagnóstico se puede eliminar cuando no la necesites.</p>
        </div>
      )}
    </div>
  )
}
