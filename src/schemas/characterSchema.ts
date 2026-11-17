import { z } from 'zod'
import { Role } from '../../src/generated/prisma/enums.js'

// 1. Definimos un esquema base reutilizable para los parámetros con ID
const idParamSchema = z.object({
  id: z.cuid2({ error: 'ID inválido' }),
})

// Esquema para GET /:id
export const getCharacterByIdSchema = {
  params: idParamSchema,
}

// NUEVO: Esquema para POST /
export const createCharacterSchema = {
  body: z.object({
    nombre: z.string().min(1, { error: 'El nombre es obligatorio' }),
    nombreJapones: z.string().optional(),
    alias: z.string().optional(),
    edad: z.number().int().positive().optional(),
    descripcion: z.string().optional(),
    // Usamos z.enum con Object.values
    rol: z.enum(Object.values(Role) as [string, ...string[]]).optional(),
  }),
}

// NUEVO: Esquema para DELETE /:id
export const deleteCharacterSchema = {
  params: idParamSchema, // Reutilizamos el mismo esquema limpio
}

// schema para filtrado
export const getCharactersQuerySchema = {
  querystring: z.object({
    rol: z.enum(Object.values(Role) as [string, ...string[]])
      .optional()
      .describe('Filtrar por rol (DETECTIVE, PROFESOR, etc.)'),
    search: z.string().optional().describe('Buscar por nombre o alias'),
  }),
}