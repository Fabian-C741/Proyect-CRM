-- Tabla: reservas_web (reservas de visitantes anónimos desde la landing)
create table if not exists public.reservas_web (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    nombre_visitante text not null,
    telefono_visitante text not null,
    servicio_id uuid,
    servicio_nombre text,
    servicio_precio numeric(10,2) default 0,
    fecha_preferida timestamp with time zone not null,
    hora_preferida text,
    notas text,
    estado text default 'pendiente' check (estado in ('pendiente', 'confirmado', 'cancelado', 'completado')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seguridad
alter table public.reservas_web enable row level security;

-- Política: el admin dueño puede ver sus reservas
create policy "Admin ve sus reservas"
    on public.reservas_web for select
    using (auth.uid() = user_id);

-- Política: cualquiera puede insertar (visitantes anónimos)
create policy "Visitantes pueden reservar"
    on public.reservas_web for insert
    with check (true);

-- Política: el admin dueño puede gestionar
create policy "Admin gestiona sus reservas"
    on public.reservas_web for all
    using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Índice
create index if not exists idx_reservas_web_user_fecha on public.reservas_web(user_id, fecha_preferida);

notify pgrst, 'reload schema';
