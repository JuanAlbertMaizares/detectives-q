import { z } from 'zod'
import { CaseStatus } from '../../src/generated/prisma/enums.js'

export const createCaseSchema = {
  body: z.object({
    titulo: z.string().min(3, { error: 'El título debe tener al menos 3 letras' }),
    descripcion: z.string().optional(),
    dificultad: z.number().int().min(1).max(5).optional(),
    estado: z.nativeEnum(CaseStatus).optional(),
  }),
}

export const addResolutionSchema = {
  params: z.object({
    caseId: z.cuid2({ error: 'ID de caso inválido' }),
  }),
  body: z.object({
    characterId: z.cuid2({ error: 'ID de personaje inválido' }),
    rolEnCaso: z.string().optional(),
    resumen: z.string().optional(),
  }),
}