# Documentación Privada para Asistentes de IA (AI Guidelines)

Este documento contiene las reglas estrictas de arquitectura y flujo de trabajo para este proyecto (CRM + Landing Page para Maquilladora). **CUALQUIER ASISTENTE DE IA QUE TRABAJE EN ESTE PROYECTO DEBE LEER Y RESPETAR ESTAS REGLAS ANTES DE MODIFICAR CÓDIGO.**

## 1. Stack Tecnológico
- **Framework**: Next.js 15 (App Router).
- **Estilos**: TailwindCSS + CSS Modules/Inline Styles híbrido (clases `card-glass`, `btn-primary`, etc., definidas en `globals.css`).
- **Base de Datos**: Supabase (PostgreSQL). Cliente: `@supabase/supabase-js`.
- **Autenticación**: Supabase Auth (SSR auth con cookies).

## 2. Reglas Estrictas de Arquitectura (¡NO ROMPER!)
1. **NO crear rutas de configuración duplicadas**:
   - Todo lo referido a la configuración pública de la landing (Hero, Nombre, WhatsApp, Bio, Imagen) se gestiona **únicamente** en `app/(dashboard)/dashboard/configuracion`.
   - El menú lateral (`app/_components/Sidebar.tsx`) tiene una entrada "Configuración" que engloba estas opciones a través de un sistema de pestañas (`ConfiguracionClient.tsx`).
   - *Nota Histórica*: Existe una ruta `/dashboard/ajustes` que fue restaurada por petición explícita, pero la fuente principal de desarrollo y escalabilidad es `/dashboard/configuracion`. No dupliques campos entre ambas.

2. **Capa de Acceso a Datos (DAL)**:
   - Todo el *fetching* de datos para la Landing Page pública debe hacerse mediante funciones en `lib/dal/landing.ts`.
   - Nunca consultar a Supabase directamente desde los componentes de React de la Landing.

3. **Landing Page (`app/page.tsx`)**:
   - Es una "Single Page" (Página Única).
   - Los enlaces del Navbar (menú superior) deben usar anclas de HTML (ej: `#servicios`, `#cursos`, `#galeria`). **NO** usar enlaces sin el `#` si apuntan a la misma página, o causarán un error 404.
   - **Contenido por defecto (Fallbacks)**: La Landing Page tiene *placeholders* (ej. `FALLBACK_SERVICIOS`). Estos solo se muestran si la base de datos está vacía (`length === 0`). **NO** intentes editar estos fallbacks a pedido del usuario; la instrucción correcta es decirle al usuario que agregue su primer registro real desde el panel para que el fallback desaparezca automáticamente.

4. **Server Actions (`actions.ts`)**:
   - Las mutaciones de datos del Dashboard se hacen mediante Server Actions (ej. `createServicioAction`, `updateMenuItemAction`).
   - Siempre revalidar las rutas afectadas usando `revalidatePath('/')` y `revalidatePath('/dashboard/...')` al final de cada mutación para que la UI se actualice sin recargar bruscamente.

## 3. Flujo de Trabajo (Workflow)
- Cuando el usuario pida agregar un campo nuevo a una sección existente, primero verifica en qué tabla de Supabase (`supabase_schema.sql`) debe ir, escribe el script de migración, aplícalo, y solo después modifica la UI y los `actions.ts`.
- **No asumas, pregunta**: Si el usuario pide un cambio visual que interfiere con el diseño "Glassmorphism" y oscuro (fondos rgba con blur, degradados rosados/púrpuras), adviértele antes de implementarlo.
- Si vas a refactorizar un componente, **NO elimines características previamente funcionales** (ej. si editas el Navbar, asegúrate de no romper el menú móvil que fue agregado recientemente).
