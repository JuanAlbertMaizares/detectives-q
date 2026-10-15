-- CreateTable
CREATE TABLE "Detective" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Detective_pkey" PRIMARY KEY ("id")
);
