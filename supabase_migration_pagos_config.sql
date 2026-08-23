-- Migración: tabla protegida para credenciales de pago (MercadoPago)
-- RLS activada SIN políticas => nadie puede leerla/escribirla desde el cliente
-- (ni anon ni authenticated). Solo el servidor con service role.

create table if not exists public.pagos_config (
  id int primary key default 1 check (id = 1),
  mp_access_token text,
  updated_at timestamptz default now()
);

insert into public.pagos_config (id) values (1) on conflict (id) do nothing;

alter table public.pagos_config enable row level security;
