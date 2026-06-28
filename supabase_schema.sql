-- ==============================================================================
-- CRM MAQUILLADORA — SUPABASE SCHEMA & SECURITY POLICIES
-- Instrucciones: Pega todo este código en el "SQL Editor" de tu Supabase y ejecútalo.
-- ==============================================================================

-- 1. EXTENSIONES
create extension if not exists "uuid-ossp";

-- 2. TABLAS
-- Tabla: clientes
create table if not exists public.clientes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    nombre text not null,
    email text,
    telefono text,
    notas text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla: cursos (servicios ofrecidos)
create table if not exists public.cursos (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    nombre text not null,
    descripcion text,
    precio numeric(10,2) not null default 0,
    duracion_horas numeric(4,2),
    activo boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla: agenda (citas programadas)
create table if not exists public.agenda (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    cliente_id uuid not null references public.clientes(id) on delete cascade,
    curso_id uuid references public.cursos(id) on delete set null,
    fecha timestamp with time zone not null,
    estado text not null check (estado in ('pendiente', 'confirmado', 'cancelado', 'completado')) default 'pendiente',
    notas text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TRIGGERS (para auto-actualizar updated_at)
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_clientes_updated_at on public.clientes;
create trigger set_clientes_updated_at
  before update on public.clientes
  for each row execute procedure public.handle_updated_at();

-- 4. SEGURIDAD — ROW LEVEL SECURITY (RLS)
-- Esto es CRÍTICO para que un usuario no pueda ver ni editar los datos de otro usuario

alter table public.clientes enable row level security;
alter table public.cursos enable row level security;
alter table public.agenda enable row level security;

-- Políticas para Clientes
create policy "Usuarios pueden ver sus propios clientes" 
  on public.clientes for select using (auth.uid() = user_id);
create policy "Usuarios pueden insertar sus propios clientes" 
  on public.clientes for insert with check (auth.uid() = user_id);
create policy "Usuarios pueden actualizar sus propios clientes" 
  on public.clientes for update using (auth.uid() = user_id);
create policy "Usuarios pueden eliminar sus propios clientes" 
  on public.clientes for delete using (auth.uid() = user_id);

-- Políticas para Cursos
create policy "Usuarios pueden ver sus propios cursos" 
  on public.cursos for select using (auth.uid() = user_id);
create policy "Usuarios pueden insertar sus propios cursos" 
  on public.cursos for insert with check (auth.uid() = user_id);
create policy "Usuarios pueden actualizar sus propios cursos" 
  on public.cursos for update using (auth.uid() = user_id);
create policy "Usuarios pueden eliminar sus propios cursos" 
  on public.cursos for delete using (auth.uid() = user_id);

-- Políticas para Agenda
create policy "Usuarios pueden ver su propia agenda" 
  on public.agenda for select using (auth.uid() = user_id);
create policy "Usuarios pueden insertar su propia agenda" 
  on public.agenda for insert with check (auth.uid() = user_id);
create policy "Usuarios pueden actualizar su propia agenda" 
  on public.agenda for update using (auth.uid() = user_id);
create policy "Usuarios pueden eliminar su propia agenda" 
  on public.agenda for delete using (auth.uid() = user_id);

-- 5. ÍNDICES DE RENDIMIENTO
create index if not exists idx_clientes_user_id on public.clientes(user_id);
create index if not exists idx_cursos_user_id on public.cursos(user_id);
create index if not exists idx_agenda_user_id_fecha on public.agenda(user_id, fecha);
create index if not exists idx_agenda_cliente_id on public.agenda(cliente_id);
