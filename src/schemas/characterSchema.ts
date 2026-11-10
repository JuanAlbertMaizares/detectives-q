import { z } from 'zod'

export const getCharacterByIdSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'ID inválido' }),
  }),
})