-- MIGRACIÓN: Secciones personalizables de la landing — CRM Maquilladora
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query > Run
-- Agrega columna jsonb para guardar título, descripción y visibilidad
-- de cada sección (💆 servicio | 🎓 curso | 📄 pdf | 📚 ebook)
--
-- Nota: si aún no ejecutaste esta migración, la app sigue funcionando
-- con los títulos por defecto; solo fallará al guardar desde el editor.

alter table public.site_settings
  add column if not exists secciones_config jsonb;

comment on column public.site_settings.secciones_config is
  'Config de secciones landing: { servicio|curso|pdf|ebook: { visible, titulo, descripcion } }';
