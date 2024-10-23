/*
  Warnings:

  - You are about to drop the `Source` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_emoteId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_hairstyleId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_minionId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_mountId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_spellId_fkey";

-- DropTable
DROP TABLE "Source";

-- CreateTable
CREATE TABLE "MinionSource" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "minionId" TEXT,

    CONSTRAINT "MinionSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MountSource" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "mountId" TEXT,

    CONSTRAINT "MountSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrchestrionSource" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "orchestrionId" TEXT,

    CONSTRAINT "OrchestrionSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpellSource" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "spellId" TEXT,

    CONSTRAINT "SpellSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardSource" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "cardId" TEXT,

    CONSTRAINT "CardSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HairstyleSource" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "hairstyleId" TEXT,

    CONSTRAINT "HairstyleSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmoteSource" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "emoteId" TEXT,

    CONSTRAINT "EmoteSource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MinionSource" ADD CONSTRAINT "Source_minionId_fkey" FOREIGN KEY ("minionId") REFERENCES "Minion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MountSource" ADD CONSTRAINT "MountSource_mountId_fkey" FOREIGN KEY ("mountId") REFERENCES "Mount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrchestrionSource" ADD CONSTRAINT "OrchestrionSource_orchestrionId_fkey" FOREIGN KEY ("orchestrionId") REFERENCES "Orchestrion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpellSource" ADD CONSTRAINT "SpellSource_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardSource" ADD CONSTRAINT "CardSource_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HairstyleSource" ADD CONSTRAINT "HairstyleSource_hairstyleId_fkey" FOREIGN KEY ("hairstyleId") REFERENCES "Hairstyle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmoteSource" ADD CONSTRAINT "EmoteSource_emoteId_fkey" FOREIGN KEY ("emoteId") REFERENCES "Emote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
