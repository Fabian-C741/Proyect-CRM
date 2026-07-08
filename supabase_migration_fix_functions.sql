-- Reemplazar funciones con versión corregida

drop function if exists public.insert_portfolio_item;
drop function if exists public.insert_servicio;

create or replace function public.insert_portfolio_item(
  p_user_id uuid,
  p_imagen_url text,
  p_descripcion text default null
) returns uuid
language plpgsql
security definer
as $$
declare
  new_id uuid;
begin
  insert into portfolio (user_id, imagen_url, descripcion, orden)
  values (p_user_id, p_imagen_url, p_descripcion, 0)
  returning id into new_id;
  return new_id;
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
) returns uuid
language plpgsql
security definer
as $$
declare
  new_id uuid;
begin
  insert into servicios (user_id, nombre, descripcion, imagen_url, precio, duracion_minutos, orden, activo)
  values (p_user_id, p_nombre, p_descripcion, p_imagen_url, p_precio, p_duracion_minutos, p_orden, true)
  returning id into new_id;
  return new_id;
end;
$$;
