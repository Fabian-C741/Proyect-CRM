-- Agregar campo para ícono de la PWA/APK
alter table public.site_settings
add column if not exists pwa_icon_url text;

notify pgrst, 'reload schema';
