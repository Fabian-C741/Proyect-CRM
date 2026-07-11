import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/dal/auth'
import SettingsForm from './SettingsForm'

export const metadata = {
  title: 'Ajustes del Sitio — CRM',
}

export default async function AjustesPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createSupabaseServerClient()
  
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <div style={{ animation: 'authFadeUp 0.4s ease-out forwards' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ajustes del Sitio (CMS)</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Edita la información de tu página web pública y el título de tu marca.
        </p>
      </header>
      
      <SettingsForm initialData={settings || {}} />
    </div>
  )
}
