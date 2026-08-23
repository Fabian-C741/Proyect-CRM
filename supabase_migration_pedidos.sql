-- ============================================================================
-- MIGRACIÓN: Pedidos / pagos — CRM Maquilladora
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query > Run
-- ============================================================================

create table if not exists public.pedidos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  producto_id uuid references public.cursos(id) on delete set null,
  tipo text,
  nombre_cliente text,
  email text,
  telefono text,
  monto numeric(10,2) not null default 0,
  estado text not null default 'pendiente'
    check (estado in ('pendiente','pagado','expirado','cancelado','pendiente_manual')),
  mp_preference_id text,
  mp_payment_id text,
  comprobante_url text,
  download_token uuid,
  download_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists pedidos_user_id_idx on public.pedidos(user_id);
create index if not exists pedidos_estado_idx on public.pedidos(estado);
create unique index if not exists pedidos_download_token_idx
  on public.pedidos(download_token) where download_token is not null;

alter table public.pedidos enable row level security;

create policy "Dueño gestiona sus pedidos"
  on public.pedidos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Ampliar los modos de venta permitidos en cursos
do $$
declare
  r record;
begin
  for r in (
    select conname from pg_constraint
    where conrelid = 'public.cursos'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%modo_venta%'
  ) loop
    execute format('alter table public.cursos drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.cursos
  add constraint cursos_modo_venta_check
  check (modo_venta in ('whatsapp','link_externo','mensaje','mercadopago','transferencia'));
