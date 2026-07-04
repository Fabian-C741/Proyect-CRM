-- ==============================================================================
-- MIGRACIÓN: Tabla menu_items — CRM Maquilladora
-- Instrucciones: Pega este código en el "SQL Editor" de tu Supabase y ejecútalo.
-- ==============================================================================

-- Tabla: menu_items (navegación dinámica de la landing page)
create table if not exists public.menu_items (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    label text not null,
    href text,
    orden int default 0 not null,
    activo boolean default true not null,
    parent_id uuid references public.menu_items(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seguridad: habilitar RLS
alter table public.menu_items enable row level security;

-- Política: lectura pública de elementos activos (para la landing)
create policy "Lectura pública de menu_items activos"
    on public.menu_items for select
    using (activo = true);

-- Política: gestión privada (escritura solo para el dueño)
create policy "Usuarios gestionan su menú"
    on public.menu_items for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Índice de rendimiento
create index if not exists idx_menu_items_user_id on public.menu_items(user_id, orden);
create index if not exists idx_menu_items_parent_id on public.menu_items(parent_id);
