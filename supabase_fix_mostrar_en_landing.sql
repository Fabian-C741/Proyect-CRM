-- Corregir registros existentes: setear mostrar_en_landing = true
-- (el bug del hidden input siempre guardaba false)
update public.cursos set mostrar_en_landing = true
where mostrar_en_landing = false or mostrar_en_landing is null;

-- Recargar schema
notify pgrst, 'reload schema';
