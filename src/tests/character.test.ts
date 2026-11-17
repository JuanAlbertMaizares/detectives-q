import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '../server.js'
import { prisma } from '../lib/prisma.js'

describe('Character API', () => {
  // Antes de los tests, nos aseguramos de tener datos (usando el seed o creando uno)
  beforeAll(async () => {
    // 1. CRUCIAL: Esperar a que Fastify termine de inicializar
    await app.ready()
    
    // 2. Limpieza y creación del personaje de prueba
    await prisma.character.deleteMany()
    await prisma.character.create({
      data: {
        nombre: 'Personaje Test',
        rol: 'DETECTIVE',
      },
    })
  })

  // Cerramos la conexión al terminar
  afterAll(async () => {
    // Cerramos el servidor de Fastify y la conexión a Prisma
    await app.close()
    await prisma.$disconnect()
  })

  it('debería devolver un 200 y una lista de personajes', async () => {
    const response = await request(app.server).get('/characters')
    
    expect(response.status).toBe(200)
    expect(response.body.data).toBeInstanceOf(Array)
    expect(response.body.data[0].nombre).toBe('Personaje Test')
  })

  it('debería devolver un 404 si el personaje no existe', async () => {
    const response = await request(app.server).get('/characters/tz8w1x2noexiste')
    
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Personaje no encontrado')
  })
})