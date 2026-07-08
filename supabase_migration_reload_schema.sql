-- ==============================================================================
-- MIGRACIÓN: Función para recargar esquema de PostgREST
-- ==============================================================================

create or replace function public.reload_pgrst_schema()
returns void
language plpgsql
security definer
as $$
begin
  notify pgrst, 'reload schema';
end;
$$;
