import { prisma } from '../lib/prisma.js'
import { z } from 'zod'
import { createCharacterSchema } from '../schemas/characterSchema.js'

type CreateCharacterInput = z.infer<typeof createCharacterSchema.body>

export class CharacterService {
  static async getAll() {
    return prisma.character.findMany({
      include: {
        grupos: true,
        skills: true,
      },
    })
  }

  static async getById(id: string) {
    return prisma.character.findUnique({
      where: { id },
      include: { grupos: true, skills: true, resoluciones: { include: { case: true } } },
    })
  }

  // NUEVO: Crear
  static async create(data: CreateCharacterInput) {
    return prisma.character.create({
      data,
    })
  }

  // NUEVO: Eliminar
  static async delete(id: string) {
    return prisma.character.delete({
      where: { id },
    })
  }
}