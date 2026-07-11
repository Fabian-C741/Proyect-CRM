-- Agregar campos de botón personalizable a portfolio
alter table public.portfolio
add column if not exists boton_texto text,
add column if not exists boton_enlace text;

-- Recargar caché de PostgREST
notify pgrst, 'reload schema';
