/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CardStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Minion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Mount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Orchestrion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Source` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Spell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `VerminionStats` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CardStats" DROP CONSTRAINT "CardStats_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_minionId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_mountId_fkey";

-- DropForeignKey
ALTER TABLE "Source" DROP CONSTRAINT "Source_spellId_fkey";

-- DropForeignKey
ALTER TABLE "VerminionStats" DROP CONSTRAINT "VerminionStats_minionId_fkey";

-- DropForeignKey
ALTER TABLE "_CardToUser" DROP CONSTRAINT "_CardToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MinionToUser" DROP CONSTRAINT "_MinionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MountToUser" DROP CONSTRAINT "_MountToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrchestrionToUser" DROP CONSTRAINT "_OrchestrionToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SpellToUser" DROP CONSTRAINT "_SpellToUser_A_fkey";

-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Card_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Card_id_seq";

-- AlterTable
ALTER TABLE "CardStats" DROP CONSTRAINT "CardStats_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cardId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CardStats_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CardStats_id_seq";

-- AlterTable
ALTER TABLE "Minion" DROP CONSTRAINT "Minion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Minion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Minion_id_seq";

-- AlterTable
ALTER TABLE "Mount" DROP CONSTRAINT "Mount_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Mount_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Mount_id_seq";

-- AlterTable
ALTER TABLE "Orchestrion" DROP CONSTRAINT "Orchestrion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Orchestrion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Orchestrion_id_seq";

-- AlterTable
ALTER TABLE "Source" DROP CONSTRAINT "Source_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "minionId" DROP NOT NULL,
ALTER COLUMN "minionId" SET DATA TYPE TEXT,
ALTER COLUMN "mountId" DROP NOT NULL,
ALTER COLUMN "mountId" SET DATA TYPE TEXT,
ALTER COLUMN "spellId" DROP NOT NULL,
ALTER COLUMN "spellId" SET DATA TYPE TEXT,
ALTER COLUMN "cardId" DROP NOT NULL,
ALTER COLUMN "cardId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Source_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Source_id_seq";

-- AlterTable
ALTER TABLE "Spell" DROP CONSTRAINT "Spell_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Spell_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Spell_id_seq";

-- AlterTable
ALTER TABLE "VerminionStats" DROP CONSTRAINT "VerminionStats_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "minionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "VerminionStats_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VerminionStats_id_seq";

-- AlterTable
ALTER TABLE "_CardToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_MinionToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_MountToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_OrchestrionToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_SpellToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "VerminionStats" ADD CONSTRAINT "VerminionStats_minionId_fkey" FOREIGN KEY ("minionId") REFERENCES "Minion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_minionId_fkey" FOREIGN KEY ("minionId") REFERENCES "Minion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_mountId_fkey" FOREIGN KEY ("mountId") REFERENCES "Mount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardStats" ADD CONSTRAINT "CardStats_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinionToUser" ADD CONSTRAINT "_MinionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Minion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToUser" ADD CONSTRAINT "_MountToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Mount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToUser" ADD CONSTRAINT "_OrchestrionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Orchestrion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToUser" ADD CONSTRAINT "_SpellToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Spell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToUser" ADD CONSTRAINT "_CardToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;
