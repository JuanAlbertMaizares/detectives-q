// src/routes/characterRoutes.ts
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { CharacterService } from '../services/characterService.js'
import { getCharacterByIdSchema } from '../schemas/characterSchema.js'

// Usamos el tipo específico que ya sabe de Zod
export const characterRoutes: FastifyPluginAsyncZod = async (app) => {
  
  // Al usar FastifyPluginAsyncZod, 'app' ya tiene el provider.
  // No necesitás hacer 'app.withTypeProvider' de nuevo.

  app.get('/', async (request, reply) => {
    const characters = await CharacterService.getAll()
    return { data: characters }
  })

  app.get('/:id', { schema: getCharacterByIdSchema }, async (request, reply) => {
    // Ahora TypeScript debería inferir correctamente que request.params tiene 'id'
    const { id } = request.params 
    const character = await CharacterService.getById(id)
    
    if (!character) {
      return reply.status(404).send({ error: 'Personaje no encontrado' })
    }
    
    return { data: character }
  })
}