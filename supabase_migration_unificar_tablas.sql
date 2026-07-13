-- ==============================================================================
-- MIGRACIÓN: UNIFICAR servicios → cursos
-- ==============================================================================
-- 1. Agrega columna orden a cursos
-- 2. Migra datos existentes de servicios a cursos
-- 3. Recarga schema cache

-- 1. Agregar columna orden a cursos
alter table public.cursos add column if not exists orden int default 0 not null;

-- 2. Migrar datos de servicios a cursos
insert into public.cursos (user_id, nombre, descripcion, activo, imagen_url, tipo, modo_venta, mostrar_en_landing, orden, created_at)
select
  s.user_id,
  s.nombre,
  s.descripcion,
  coalesce(s.activo, true),
  s.imagen_url,
  'servicio' as tipo,
  case when coalesce(s.precio, 0) > 0 then 'whatsapp' else 'mensaje' end as modo_venta,
  true as mostrar_en_landing,
  coalesce(s.orden, 0),
  s.created_at
from public.servicios s
where not exists (
  select 1 from public.cursos c
  where c.user_id = s.user_id and c.nombre = s.nombre and c.tipo = 'servicio'
);

-- 3. Índice para orden
create index if not exists idx_cursos_orden on public.cursos(user_id, orden);

-- 4. Recargar schema cache para PostgREST
notify pgrst, 'reload schema';
