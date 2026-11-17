import { prisma } from '../lib/prisma.js'
import { z } from 'zod'
import { createCharacterSchema } from '../schemas/characterSchema.js'
import { Role } from '../generated/prisma/enums.js'

type CreateCharacterInput = z.infer<typeof createCharacterSchema.body>

export class CharacterService {
  static async getAll(filters: { rol?: Role, search?: string }) {
    return prisma.character.findMany({
      where: {
        rol: filters.rol, // Si es undefined, Prisma lo ignora
        OR: filters.search ? [
          { nombre: { contains: filters.search, mode: 'insensitive' } },
          { alias: { contains: filters.search, mode: 'insensitive' } },
        ] : undefined,
      },
      include: { grupos: true, skills: true },
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