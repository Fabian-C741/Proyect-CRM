-- ==============================================================================
-- FIX: Recrear tablas portfolio y servicios + recargar caché PostgREST
-- Pegá TODO esto en el SQL Editor de Supabase y ejecutalo UNA sola vez.
-- ==============================================================================

-- 1. Asegurar que las tablas existen (IF NOT EXISTS)
create table if not exists public.servicios (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    nombre text not null,
    descripcion text,
    imagen_url text,
    precio numeric(10,2) default 0,
    duracion_minutos int,
    orden int default 0,
    activo boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.portfolio (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    imagen_url text not null,
    descripcion text,
    orden int default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. RLS si no existe
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'servicios' and policyname = 'Lectura pública de servicios activos') then
    alter table public.servicios enable row level security;
    create policy "Lectura pública de servicios activos" on public.servicios for select using (activo = true);
    create policy "Usuarios gestionan sus servicios" on public.servicios for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'portfolio' and policyname = 'Lectura pública de portfolio') then
    alter table public.portfolio enable row level security;
    create policy "Lectura pública de portfolio" on public.portfolio for select using (true);
    create policy "Usuarios gestionan su portfolio" on public.portfolio for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- 3. RECARGAR CACHÉ DE PostgREST (ESTO ES LO QUE FALTA)
notify pgrst, 'reload schema';
