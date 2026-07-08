-- ==============================================================================
-- MIGRACIÓN: Funciones para insertar datos evitando caché de esquema
-- ==============================================================================

create or replace function public.insert_portfolio_item(
  p_user_id uuid,
  p_imagen_url text,
  p_descripcion text default null
) returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  insert into public.portfolio (user_id, imagen_url, descripcion, orden)
  values (p_user_id, p_imagen_url, p_descripcion, 0)
  returning row_to_json(portfolio.*) into result;
  return result;
end;
$$;

create or replace function public.insert_servicio(
  p_user_id uuid,
  p_nombre text,
  p_descripcion text default null,
  p_imagen_url text default null,
  p_precio numeric default 0,
  p_duracion_minutos int default null,
  p_orden int default 0
) returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  insert into public.servicios (user_id, nombre, descripcion, imagen_url, precio, duracion_minutos, orden, activo)
  values (p_user_id, p_nombre, p_descripcion, p_imagen_url, p_precio, p_duracion_minutos, p_orden, true)
  returning row_to_json(servicios.*) into result;
  return result;
end;
$$;
