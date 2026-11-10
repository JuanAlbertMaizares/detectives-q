// src/server.ts
import Fastify from 'fastify'
import { prisma } from './lib/prisma.js'

const app = Fastify({
  logger: true, // Habilita los logs nativos de Fastify (muy útiles)
})

// 1. Ruta de salud (Health Check)
app.get('/health', async () => {
  return { status: 'ok', message: 'Detectives-Q API funcionando' }
})

// 2. Primer endpoint: Listar todos los personajes
app.get('/characters', async (request, reply) => {
  try {
    const personajes = await prisma.character.findMany({
      include: {
        grupos: true,
        skills: true,
      },
    })
    
    return { data: personajes }
  } catch (error) {
    app.log.error(error)
    return reply.status(500).send({ error: 'Error al obtener los personajes' })
  }
})

// 3. Función para iniciar el servidor
const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 Servidor corriendo en http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()