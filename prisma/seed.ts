// prisma/seed.ts
import 'dotenv/config'
import { prisma } from '../src/lib/prisma.js' 
import { Role, GroupType, CaseStatus, SkillType } from '../src/generated/prisma/enums.js'

async function main() {
  console.log('🌱 Iniciando seed de detectives-q...')

  // 1. Limpiamos la base de datos (el orden importa por las llaves foráneas)
  await prisma.caseResolution.deleteMany()
  await prisma.case.deleteMany()
  await prisma.character.deleteMany()
  await prisma.group.deleteMany()
  await prisma.skill.deleteMany()

  console.log('🧹 Base de datos limpia.')

  // 2. Creamos los Grupos
  const claseQ = await prisma.group.create({
    data: {
      nombre: 'Clase Q',
      tipo: GroupType.CLASE_Q,
      descripcion: 'Grupo especial de la Academia Dan Detective.',
    },
  })

  const pluto = await prisma.group.create({
    data: {
      nombre: 'Pluto',
      tipo: GroupType.PLUTO,
      descripcion: 'Organización criminal antagonista.',
    },
  })

  // 3. Creamos Habilidades
  const memoria = await prisma.skill.create({
    data: { nombre: 'Memoria Fotográfica', tipo: SkillType.COGNITIVA },
  })
  const oido = await prisma.skill.create({
    data: { nombre: 'Oído Absoluto', tipo: SkillType.SENSORIAL },
  })

  // 4. Creamos Personajes
  const q = await prisma.character.create({
    data: {
      nombre: 'Kyu',
      nombreJapones: 'キュウ',
      alias: 'Q',
      edad: 15,
      rol: Role.DETECTIVE,
      descripcion: 'Genio detective, heredero de la sangre de King Hades.',
      grupos: { connect: [{ id: claseQ.id }] },
      skills: { connect: [{ id: memoria.id }] },
    },
  })

  const meg = await prisma.character.create({
    data: {
      nombre: 'Meg',
      nombreJapones: 'メグ',
      edad: 14,
      rol: Role.DETECTIVE,
      descripcion: 'Experta en música y sonidos.',
      grupos: { connect: [{ id: claseQ.id }] },
      skills: { connect: [{ id: oido.id }] },
    },
  })

  const kingHades = await prisma.character.create({
    data: {
      nombre: 'Rey Hades',
      alias: 'King Hades',
      rol: Role.ANTAGONISTA,
      descripcion: 'Líder de Pluto.',
      grupos: { connect: [{ id: pluto.id }] },
    },
  })

  // 5. Creamos un Caso
  const caso1 = await prisma.case.create({
    data: {
      titulo: 'El acertijo de la habitación cerrada',
      descripcion: 'Un asesinato imposible en la Academia.',
      dificultad: 4,
      estado: CaseStatus.RESUELTO,
    },
  })

  // 6. Registramos quién resolvió el caso (CaseResolution)
  await prisma.caseResolution.createMany({
    data: [
      {
        caseId: caso1.id,
        characterId: q.id,
        rolEnCaso: 'Detective principal',
        resumen: 'Resolvió el acertijo lógico.',
      },
      {
        caseId: caso1.id,
        characterId: meg.id,
        rolEnCaso: 'Apoyo',
        resumen: 'Identificó una pista sonora clave.',
      },
    ],
  })

  console.log('✅ Seed completado exitosamente.')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    // Importante: cerramos la conexión a la base de datos
    await prisma.$disconnect()
  })