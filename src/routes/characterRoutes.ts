import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { CharacterService } from '../services/characterService.js'
import { 
  getCharacterByIdSchema, 
  createCharacterSchema, 
  deleteCharacterSchema, 
  getCharactersQuerySchema
} from '../schemas/characterSchema.js'

export async function characterRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>()

  // GET ALL
  server.get('/', { schema: getCharactersQuerySchema }, async (request) => {
    const { rol, search } = request.query
    const characters = await CharacterService.getAll({ rol, search })
    return { data: characters }
  })

  // GET BY ID
  server.get('/:id', { schema: getCharacterByIdSchema }, async (request, reply) => {
    const { id } = request.params 
    const character = await CharacterService.getById(id)
    if (!character) return reply.status(404).send({ error: 'Personaje no encontrado' })
    return { data: character }
  })

  // POST (Crear)
  server.post('/', { schema: createCharacterSchema }, async (request, reply) => {
    // request.body ya está tipado y validado por Zod
    const nuevoPersonaje = await CharacterService.create(request.body)
    return reply.status(201).send({ data: nuevoPersonaje })
  })

  // DELETE (Eliminar)
  server.delete('/:id', { schema: deleteCharacterSchema }, async (request, reply) => {
    const { id } = request.params
    try {
      await CharacterService.delete(id)
      return reply.status(204).send() // 204 No Content
    } catch (error) {
      // Si Prisma no lo encuentra, tira un error P2025
      return reply.status(404).send({ error: 'Personaje no encontrado' })
    }
  })
}