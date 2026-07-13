import { runDiagnostics } from '@/lib/debug/runner'
import DebugClient from './DebugClient'

export const dynamic = 'force-dynamic'

export default async function DebugPage() {
  const { timestamp, results } = await runDiagnostics()
  return <DebugClient timestamp={timestamp} results={results} />
}
