-- MIGRACIÓN: Páginas personalizables — CRM Maquilladora
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query > Run
-- Crea la tabla `paginas`: páginas nuevas creadas desde el dashboard,
-- accesibles en /p/<slug> y enlazadas automáticamente en el menú superior.

create table if not exists public.paginas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  titulo text not null,
  contenido text,
  activo boolean default true,
  created_at timestamptz default now()
);

-- Un mismo slug no se repite para el mismo usuario
create unique index if not exists paginas_user_slug_idx
  on public.paginas (user_id, slug);

alter table public.paginas enable row level security;

create policy "Lectura pública de paginas"
  on public.paginas for select using (true);

create policy "Dueño gestiona sus paginas"
  on public.paginas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
