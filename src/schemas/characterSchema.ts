import { z } from 'zod'

export const getCharacterByIdSchema = {
  params: z.object({
    id: z.cuid({ error: 'ID inválido' }),
  }),
}