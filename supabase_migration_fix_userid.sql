-- Fix: asegurar que user_id en site_settings no sea null
-- Primero, eliminar filas con user_id null (si las hay)
delete from public.site_settings where user_id is null;

-- Luego forzar not null
alter table public.site_settings alter column user_id set not null;

-- Recargar caché
notify pgrst, 'reload schema';
