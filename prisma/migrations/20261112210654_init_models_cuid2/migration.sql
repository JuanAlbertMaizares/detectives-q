-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DETECTIVE', 'PROFESOR', 'DIRECTOR', 'ANTAGONISTA', 'ALIADO');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('CLASE_Q', 'AYATSURI', 'PLUTO', 'ACADEMIA', 'OTRO');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'RESUELTO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('COGNITIVA', 'FISICA', 'SENSORIAL', 'TECNICA', 'SOCIAL', 'OTRA');

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nombre_japones" TEXT,
    "alias" TEXT,
    "edad" INTEGER,
    "descripcion" TEXT,
    "imagen_url" TEXT,
    "rol" "Role" NOT NULL DEFAULT 'DETECTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "GroupType" NOT NULL DEFAULT 'OTRO',
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cases" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_hecho" TIMESTAMP(3),
    "dificultad" INTEGER,
    "estado" "CaseStatus" NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" "SkillType" NOT NULL DEFAULT 'OTRA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_resolutions" (
    "id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "character_id" TEXT NOT NULL,
    "rol_en_caso" TEXT,
    "resumen" TEXT,
    "resuelto_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_resolutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CharacterSkills_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GroupMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_nombre_key" ON "groups"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "skills_nombre_key" ON "skills"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "case_resolutions_case_id_character_id_key" ON "case_resolutions"("case_id", "character_id");

-- CreateIndex
CREATE INDEX "_CharacterSkills_B_index" ON "_CharacterSkills"("B");

-- CreateIndex
CREATE INDEX "_GroupMembers_B_index" ON "_GroupMembers"("B");

-- AddForeignKey
ALTER TABLE "case_resolutions" ADD CONSTRAINT "case_resolutions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_resolutions" ADD CONSTRAINT "case_resolutions_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterSkills" ADD CONSTRAINT "_CharacterSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterSkills" ADD CONSTRAINT "_CharacterSkills_B_fkey" FOREIGN KEY ("B") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMembers" ADD CONSTRAINT "_GroupMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMembers" ADD CONSTRAINT "_GroupMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
