-- MIGRACIÓN: Tipos/secciones personalizables — CRM Maquilladora
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query > Run
-- Elimina el CHECK que limitaba `cursos.tipo` a los 4 valores fijos,
-- para poder crear secciones personalizadas en la landing
-- (se configuran en Dashboard > Configuración > 🗂 Secciones Landing).

alter table public.cursos
  drop constraint if exists cursos_tipo_check;
