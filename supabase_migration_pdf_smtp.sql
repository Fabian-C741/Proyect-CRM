-- Migración: agregar columna archivo_url a cursos + campos SMTP a site_settings

alter table public.cursos add column if not exists archivo_url text;

alter table public.site_settings add column if not exists smtp_host text;
alter table public.site_settings add column if not exists smtp_port integer default 587;
alter table public.site_settings add column if not exists smtp_user text;
alter table public.site_settings add column if not exists smtp_pass text;
alter table public.site_settings add column if not exists smtp_from_email text;

-- Refrescar esquema de PostgREST
notify pgrst, 'reload schema';
