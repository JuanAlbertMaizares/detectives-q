import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CaseService } from '../services/caseService.js'
import { createCaseSchema, addResolutionSchema } from '../schemas/caseSchema.js'

export async function caseRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>()

  // GET /cases
  server.get('/', async () => {
    const cases = await CaseService.getAll()
    return { data: cases }
  })

  // POST /cases
  server.post('/', { schema: createCaseSchema }, async (request, reply) => {
    const newCase = await CaseService.create(request.body)
    return reply.status(201).send({ data: newCase })
  })

  // POST /cases/:caseId/resolutions (Asociar personaje a caso)
  server.post('/:caseId/resolutions', { schema: addResolutionSchema }, async (request, reply) => {
    const { caseId } = request.params
    const { characterId, rolEnCaso, resumen } = request.body

    try {
      const resolution = await CaseService.addResolution(caseId, { characterId, rolEnCaso, resumen })
      return reply.status(201).send({ data: resolution })
    } catch (error) {
      // Si el ID del caso o del personaje no existen, Prisma tira un error
      return reply.status(400).send({ error: 'No se pudo crear la resolución. Verificá los IDs.' })
    }
  })
}