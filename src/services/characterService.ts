import { prisma } from '../lib/prisma.js'

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
      include: {
        grupos: true,
        skills: true,
        resoluciones: {
          include: { case: true }
        }
      },
    })
  }
}