import { prisma } from '../lib/prisma.js'

export class CaseService {
  static async create(data: any) {
    return prisma.case.create({ data })
  }

  static async getAll() {
    return prisma.case.findMany({
      include: {
        resoluciones: {
          include: { character: { select: { nombre: true, alias: true } } },
        },
      },
    })
  }

  // Asociar un personaje a un caso (Crear CaseResolution)
  static async addResolution(caseId: string, data: { characterId: string, rolEnCaso?: string, resumen?: string }) {
    return prisma.caseResolution.create({
      data: {
        caseId,
        characterId: data.characterId,
        rolEnCaso: data.rolEnCaso,
        resumen: data.resumen,
      },
    })
  }
}