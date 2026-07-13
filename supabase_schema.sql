-- ==============================================================================
-- CRM MAQUILLADORA — SUPABASE SCHEMA & SECURITY POLICIES
-- Instrucciones: Pega todo este código en el "SQL Editor" de tu Supabase y ejecútalo.
-- ==============================================================================

-- 1. EXTENSIONES
create extension if not exists "uuid-ossp";

-- 2. TABLAS BASE
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

-- Tabla: cursos (servicios / productos ofrecidos)
create table if not exists public.cursos (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    nombre text not null,
    descripcion text,
    precio numeric(10,2) not null default 0,
    duracion_horas numeric(5,2),
    activo boolean default true not null,
    imagen_url text,
    tipo text default 'servicio' check (tipo in ('servicio', 'curso', 'pdf', 'ebook')),
    modo_venta text default 'whatsapp' check (modo_venta in ('whatsapp', 'link_externo', 'mensaje')),
    link_externo text,
    mensaje_whatsapp text,
    mostrar_en_landing boolean default true not null,
    orden int default 0 not null,
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

-- Tabla: site_settings (configuración global del sitio)
create table if not exists public.site_settings (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    brand_name text default 'Mi Estudio',
    hero_title text default 'Realza tu belleza natural',
    hero_subtitle text,
    hero_cta_text text default 'Reserva tu turno',
    whatsapp_number text,
    sobre_mi_texto text,
    sobre_mi_imagen_url text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

-- Tabla: portfolio (galería de trabajos)
create table if not exists public.portfolio (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    imagen_url text not null,
    descripcion text,
    orden int default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla: testimonios
create table if not exists public.testimonios (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    nombre_cliente text not null,
    texto text not null,
    estrellas int default 5 check (estrellas between 1 and 5),
    activo boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

alter table public.clientes enable row level security;
alter table public.cursos enable row level security;
alter table public.agenda enable row level security;
alter table public.site_settings enable row level security;
-- (servicios table was merged into cursos)
alter table public.portfolio enable row level security;
alter table public.testimonios enable row level security;
alter table public.menu_items enable row level security;

-- Políticas para Clientes (privadas)
create policy "Usuarios pueden ver sus propios clientes" 
  on public.clientes for select using (auth.uid() = user_id);
create policy "Usuarios pueden insertar sus propios clientes" 
  on public.clientes for insert with check (auth.uid() = user_id);
create policy "Usuarios pueden actualizar sus propios clientes" 
  on public.clientes for update using (auth.uid() = user_id);
create policy "Usuarios pueden eliminar sus propios clientes" 
  on public.clientes for delete using (auth.uid() = user_id);

-- Políticas para Cursos (mixto: lectura pública de activos, write privado)
create policy "Lectura pública de cursos activos"
  on public.cursos for select using (activo = true and mostrar_en_landing = true);
create policy "Usuarios pueden ver todos sus cursos"
  on public.cursos for select using (auth.uid() = user_id);
create policy "Usuarios pueden insertar sus propios cursos" 
  on public.cursos for insert with check (auth.uid() = user_id);
create policy "Usuarios pueden actualizar sus propios cursos" 
  on public.cursos for update using (auth.uid() = user_id);
create policy "Usuarios pueden eliminar sus propios cursos" 
  on public.cursos for delete using (auth.uid() = user_id);

-- Políticas para Agenda (privadas)
create policy "Usuarios pueden ver su propia agenda" 
  on public.agenda for select using (auth.uid() = user_id);
create policy "Usuarios pueden insertar su propia agenda" 
  on public.agenda for insert with check (auth.uid() = user_id);
create policy "Usuarios pueden actualizar su propia agenda" 
  on public.agenda for update using (auth.uid() = user_id);
create policy "Usuarios pueden eliminar su propia agenda" 
  on public.agenda for delete using (auth.uid() = user_id);

-- Políticas para site_settings (lectura pública, write privado)
create policy "Lectura pública de site_settings"
  on public.site_settings for select using (true);
create policy "Usuarios gestionan sus settings"
  on public.site_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Políticas para Portfolio (lectura pública, write privado)
create policy "Lectura pública de portfolio"
  on public.portfolio for select using (true);
create policy "Usuarios gestionan su portfolio"
  on public.portfolio for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Políticas para Testimonios (lectura pública activos, write privado)
create policy "Lectura pública de testimonios activos"
  on public.testimonios for select using (activo = true);
create policy "Usuarios gestionan sus testimonios"
  on public.testimonios for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Políticas para Menu Items (lectura pública activos, write privado)
create policy "Lectura pública de menu_items activos"
  on public.menu_items for select using (activo = true);
create policy "Usuarios gestionan su menú"
  on public.menu_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. ÍNDICES DE RENDIMIENTO
create index if not exists idx_clientes_user_id on public.clientes(user_id);
create index if not exists idx_cursos_user_id on public.cursos(user_id);
create index if not exists idx_cursos_landing on public.cursos(activo, mostrar_en_landing);
create index if not exists idx_agenda_user_id_fecha on public.agenda(user_id, fecha);
create index if not exists idx_agenda_cliente_id on public.agenda(cliente_id);
create index if not exists idx_cursos_orden on public.cursos(user_id, orden);
create index if not exists idx_portfolio_user_id on public.portfolio(user_id, orden);
create index if not exists idx_testimonios_user_id on public.testimonios(user_id);
create index if not exists idx_menu_items_user_id on public.menu_items(user_id, orden);
create index if not exists idx_menu_items_parent_id on public.menu_items(parent_id);
