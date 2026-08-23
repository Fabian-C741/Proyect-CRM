-- ============================================================
-- MIGRACIÓN: Bloques de contenido enriquecido para páginas
-- Ejecutar en Supabase > SQL Editor (una sola vez)
-- ============================================================

alter table public.paginas
  add column if not exists bloques jsonb default '[]'::jsonb;
