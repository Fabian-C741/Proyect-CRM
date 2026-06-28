import { z } from 'zod'

// ============================================================
// SCHEMAS DE VALIDACIÓN (Zod)
// ============================================================

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Ingresa un email válido.' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
    .trim(),
})

export const ClienteSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre es obligatorio.' }).trim(),
  email: z.string().email({ message: 'Email inválido.' }).trim().optional().or(z.literal('')),
  telefono: z.string().trim().optional(),
  notas: z.string().trim().optional(),
})

export const CursoSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre del curso es obligatorio.' }).trim(),
  descripcion: z.string().trim().optional(),
  precio: z.number().positive({ message: 'El precio debe ser mayor a 0.' }),
  duracion_horas: z.number().positive().optional(),
})

export const AgendaSchema = z.object({
  cliente_id: z.string().uuid(),
  curso_id: z.string().uuid().optional(),
  fecha: z.string().datetime(),
  notas: z.string().trim().optional(),
})

// ============================================================
// TIPOS (inferidos de los schemas)
// ============================================================

export type LoginData = z.infer<typeof LoginSchema>
export type ClienteData = z.infer<typeof ClienteSchema>
export type CursoData = z.infer<typeof CursoSchema>
export type AgendaData = z.infer<typeof AgendaSchema>

// ============================================================
// TIPOS DE BASE DE DATOS
// ============================================================

export type Cliente = {
  id: string
  user_id: string
  nombre: string
  email: string | null
  telefono: string | null
  notas: string | null
  created_at: string
  updated_at: string
}

export type Curso = {
  id: string
  user_id: string
  nombre: string
  descripcion: string | null
  precio: number
  duracion_horas: number | null
  activo: boolean
  created_at: string
}

export type Agenda = {
  id: string
  user_id: string
  cliente_id: string
  curso_id: string | null
  fecha: string
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'completado'
  notas: string | null
  created_at: string
  clientes?: Pick<Cliente, 'id' | 'nombre' | 'telefono'>
  cursos?: Pick<Curso, 'id' | 'nombre' | 'precio'>
}

// ============================================================
// TIPOS DE FORMULARIOS (Server Actions)
// ============================================================

export type FormState<T = Record<string, string[]>> =
  | {
      errors?: T
      message?: string
      success?: boolean
    }
  | undefined
