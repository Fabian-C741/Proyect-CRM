-- ==============================================================================
-- MIGRACIÓN: Columnas CTA final en site_settings — CRM Maquilladora
-- Permite al admin editar el título, texto y botón de la sección CTA final.
-- ==============================================================================

alter table public.site_settings
add column if not exists cta_title text,
add column if not exists cta_text text,
add column if not exists cta_button_text text;
