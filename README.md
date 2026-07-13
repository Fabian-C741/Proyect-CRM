# Mar-Makeup — CRM + Landing Page para Maquilladora Profesional

Sistema todo-en-uno: landing page pública con catálogo de productos/servicios, dashboard de administración, y venta automática de PDFs digitales.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 (App Router, Server Components) |
| Estilos | CSS Modules + clases utilitarias |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth (magic link / email) |
| Storage | Supabase Storage (imágenes, PDFs) |
| Email | Nodemailer (SMTP configurable) |
| Despliegue | Vercel |

---

## Estructura del Proyecto

```
app/
├── page.tsx                      # Landing page pública
├── layout.tsx                    # Layout raíz (favicon, manifest, SW)
├── _components/
│   ├── sections/
│   │   ├── HeroSection.tsx       # Hero de la landing
│   │   ├── CategorySection.tsx   # Sección de productos por tipo
│   │   ├── SobreMiSection.tsx    # Sección "Sobre Mí"
│   │   ├── TestimoniosSection.tsx
│   │   ├── CTASection.tsx        # Call to action final
│   │   └── ...
│   ├── CompraPdfModal.tsx        # Modal de compra de PDFs
│   ├── FileUploader.tsx          # Subida de archivos (PDF)
│   ├── ImageUploader.tsx         # Subida de imágenes
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── (dashboard)/dashboard/
│   ├── page.tsx                  # Dashboard principal
│   ├── cursos/                   # CRUD de productos/servicios
│   │   ├── page.tsx
│   │   ├── CursosClient.tsx
│   │   ├── NuevoCursoModal.tsx
│   │   ├── EditarCursoModal.tsx
│   │   └── actions.ts            # Server Actions (create, update, delete)
│   ├── ajustes/                  # Configuración del sitio
│   │   ├── page.tsx
│   │   ├── SettingsForm.tsx
│   │   └── actions.ts
│   └── debug/                    # Diagnóstico (conexión Supabase, esquema)
├── login/
│   └── page.tsx                  # Pantalla de login
└── api/
    ├── auth/callback/route.ts    # Callback OAuth de Supabase
    └── comprar-pdf/route.ts      # API de compra de PDFs

lib/
├── supabase/
│   ├── client.ts                 # Cliente browser (public)
│   ├── server.ts                 # Cliente servidor (con cookies)
│   └── admin.ts                  # Cliente admin (service_role, bypass RLS)
├── dal/
│   ├── auth.ts                   # getCurrentUser, requireAuth
│   ├── cursos.ts                 # getCursos, getCurso, getAgenda...
│   ├── landing.ts                # getProductosPublicos, getSiteSettings...
│   └── compras.ts                # comprarPdfAction
├── definitions.ts                # Tipos TypeScript (Curso, Cliente, SiteSettings...)
├── email.ts                      # Utilidad de envío de emails (SMTP)
└── debug/
    └── runner.ts                 # Tests de conexión y esquema
```

---

## Modelo de Datos

### Tablas principales

| Tabla | Descripción |
|-------|-------------|
| `cursos` | Productos unificados (servicios, cursos, PDFs, eBooks) |
| `clientes` | Clientes registrados manualmente |
| `agenda` | Citas programadas |
| `site_settings` | Configuración global (textos, WhatsApp, SMTP, etc.) |
| `portfolio` | Galería de imágenes de trabajos |
| `testimonios` | Testimonios de clientes |
| `menu_items` | Navegación dinámica de la landing |
| `reservas_web` | Reservas de visitantes anónimos |
| `bloqueos_horarios` | Bloques de disponibilidad |

### Tabla `cursos` (unificada)

Un solo origen para todos los tipos de oferta:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → auth.users |
| `nombre` | text | Nombre del producto |
| `descripcion` | text | Descripción |
| `precio` | numeric | Precio |
| `duracion_horas` | numeric | Duración (servicios/cursos) |
| `activo` | boolean | Si está activo (soft delete) |
| `imagen_url` | text | Imagen del producto |
| `archivo_url` | text | URL del archivo (PDFs) |
| `tipo` | enum | `servicio`, `curso`, `pdf`, `ebook` |
| `modo_venta` | enum | `whatsapp`, `link_externo`, `mensaje` |
| `link_externo` | text | URL externa (MercadoPago, Hotmart, etc.) |
| `mensaje_whatsapp` | text | Mensaje personalizado para WhatsApp |
| `mostrar_en_landing` | boolean | Visible en landing |
| `orden` | int | Orden de aparición |

---

## Flujo de Ventas

### PDFs (automático)
1. Cliente hace clic en "Comprar ahora" de un PDF
2. Completa formulario (nombre, WhatsApp, email opcional)
3. Sistema genera link de descarga firmado en Supabase Storage (válido 24h)
4. Cliente es redirigido a WhatsApp con el link de descarga
5. Si hay SMTP configurado, también recibe el link por email
6. Admin recibe notificación por WhatsApp (el mensaje del cliente llega a su número)

### Servicios / Cursos / eBooks (actual)
- Según `modo_venta`:
  - `whatsapp`: botón abre WhatsApp con mensaje predeterminado
  - `link_externo`: botón abre URL externa
  - `mensaje`: botón abre WhatsApp con mensaje personalizado

### Futuro
- Integración con MercadoPago para cursos online
- Formulario de inscripción + confirmación de pago vía webhook

---

## Seguridad

- **RLS (Row Level Security)** activo en todas las tablas
- Público solo puede leer productos activos + visibles, portfolio, testimonios, site_settings y menú
- Escritura siempre requiere `auth.uid() = user_id`
- `getSupabaseAdmin()` usa `service_role` key → solo en servidor (`'server-only'`), usado para operaciones que requieren bypass de RLS (reservas de visitantes anónimos, generar signed URLs)
- Server Actions usan un solo cliente Supabase por request (evita token vencido por refresh)
- Todo el input se renderiza con React JSX (escape automático, sin XSS)
- Validación con Zod en login, clientes, cursos

---

## Para empezar a usar (después del deploy)

### 1. Base de datos
Ejecutar en SQL Editor de Supabase (en orden):

1. `supabase_schema.sql` — esquema completo (solo si no existe)
2. `supabase_migration_unificar_tablas.sql` — migración unificada
3. `supabase_fix_mostrar_en_landing.sql` — corregir visibilidad
4. `supabase_migration_pdf_smtp.sql` — columnas PDF + SMTP

### 2. Storage
Crear buckets:
- `servicios` (público) — imágenes de productos
- `pdfs` (público) — archivos PDF para venta

### 3. Env vars (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # solo servidor
```

---

## Estado del Proyecto

### Completado
- [x] Landing page pública con secciones modulares (Hero, Servicios, Cursos, PDFs, eBooks, Sobre Mí, Portfolio, Testimonios, CTA)
- [x] Dashboard de administración protegido
- [x] CRUD completo de productos/servicios (tipo unificado `cursos`)
- [x] Configuración del sitio desde el dashboard (textos, WhatsApp, favicon, PWA, SMTP)
- [x] RLS policies en todas las tablas
- [x] Página de diagnóstico (debug)
- [x] Venta automática de PDFs con link firmado + notificación WhatsApp + email
- [x] Configuración SMTP para envío de emails
- [x] Sin caché en landing (siempre datos frescos)

### Pendiente
- [ ] Integración MercadoPago para cursos online (formulario de inscripción + pago)
- [ ] PWA manifest / service worker funcional en Vercel (actualmente roto)
- [ ] Bucket `pdfs` en Supabase Storage (creación manual)

### Objetivo
CRM + tienda digital completa para maquilladora profesional: landing atractiva, catálogo de productos, venta de digitales automatizada, y en el futuro cursos online con pago integrado.
