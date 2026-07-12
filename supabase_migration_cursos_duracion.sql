-- Fix duracion_horas column to support up to 999 horas (antes numeric(4,2) max 99.99)
alter table public.cursos alter column duracion_horas type numeric(5,2);

-- Forzar recarga del schema cache de PostgREST para que reconozca imagen_url y el nuevo tipo
notify pgrst, 'reload schema';
