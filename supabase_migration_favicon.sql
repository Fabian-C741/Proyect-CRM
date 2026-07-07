-- ==============================================================================
-- MIGRACIÓN: Columna favicon_url en site_settings — CRM Maquilladora
-- Permite al admin cambiar el favicon desde el panel de Ajustes.
-- ==============================================================================

alter table public.site_settings
add column if not exists favicon_url text;
