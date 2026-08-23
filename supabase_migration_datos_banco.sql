-- ============================================================================
-- MIGRACIÓN: Datos bancarios en site_settings — CRM Maquilladora
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query > Run
-- ============================================================================

alter table public.site_settings
  add column if not exists cbu text,
  add column if not exists alias_cbu text,
  add column if not exists banco text,
  add column if not exists titular_cuenta text;
