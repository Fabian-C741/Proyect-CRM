-- ==============================================================================
-- MIGRACIÓN: Tabla bloqueos_horarios — CRM Maquilladora
-- Permite al admin bloquear días completos o franjas horarias para evitar
-- que visitantes reserven en momentos no disponibles (enfermedad, viaje, etc.)
-- ==============================================================================

-- Tabla: bloqueos_horarios
create table if not exists public.bloqueos_horarios (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    fecha date not null,
    hora_inicio time,      -- Si es null, se bloquea el día completo
    hora_fin time,         -- Si es null y hora_inicio también, día completo
    motivo text,
    activo boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seguridad
alter table public.bloqueos_horarios enable row level security;

-- Política: solo el dueño ve sus bloqueos
create policy "Usuarios ven sus propios bloqueos"
    on public.bloqueos_horarios for select
    using (auth.uid() = user_id);

-- Política: solo el dueño crea bloqueos
create policy "Usuarios crean sus propios bloqueos"
    on public.bloqueos_horarios for insert
    with check (auth.uid() = user_id);

-- Política: solo el dueño actualiza sus bloqueos
create policy "Usuarios actualizan sus propios bloqueos"
    on public.bloqueos_horarios for update
    using (auth.uid() = user_id);

-- Política: solo el dueño elimina sus bloqueos
create policy "Usuarios eliminan sus propios bloqueos"
    on public.bloqueos_horarios for delete
    using (auth.uid() = user_id);

-- Índice para búsquedas rápidas por fecha
create index if not exists idx_bloqueos_fecha on public.bloqueos_horarios(user_id, fecha);
