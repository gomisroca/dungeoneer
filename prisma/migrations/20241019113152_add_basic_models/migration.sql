/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "VerminionStats" (
    "id" SERIAL NOT NULL,
    "cost" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "aoe" BOOLEAN NOT NULL,
    "skill" TEXT NOT NULL,
    "skillDescription" TEXT NOT NULL,
    "skillAngle" INTEGER NOT NULL,
    "skillCost" INTEGER NOT NULL,
    "skillType" TEXT NOT NULL,
    "eye" BOOLEAN NOT NULL,
    "gate" BOOLEAN NOT NULL,
    "shield" BOOLEAN NOT NULL,
    "minionId" INTEGER NOT NULL,

    CONSTRAINT "VerminionStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "minionId" INTEGER NOT NULL,
    "mountId" INTEGER NOT NULL,
    "spellId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Minion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patch" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "behavior" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "owned" TEXT NOT NULL,

    CONSTRAINT "Minion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mount" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patch" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "image" TEXT NOT NULL,
    "owned" TEXT NOT NULL,

    CONSTRAINT "Mount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orchestrion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patch" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "number" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "owned" TEXT NOT NULL,

    CONSTRAINT "Orchestrion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spell" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patch" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "number" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "owned" TEXT NOT NULL,

    CONSTRAINT "Spell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardStats" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "top" INTEGER NOT NULL,
    "right" INTEGER NOT NULL,
    "bottom" INTEGER NOT NULL,
    "left" INTEGER NOT NULL,

    CONSTRAINT "CardStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patch" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "stars" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "owned" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dungeon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Dungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MinionToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MountToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrchestrionToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SpellToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CardToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VerminionStats_minionId_key" ON "VerminionStats"("minionId");

-- CreateIndex
CREATE UNIQUE INDEX "CardStats_cardId_key" ON "CardStats"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "_MinionToUser_AB_unique" ON "_MinionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MinionToUser_B_index" ON "_MinionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MountToUser_AB_unique" ON "_MountToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MountToUser_B_index" ON "_MountToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrchestrionToUser_AB_unique" ON "_OrchestrionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrchestrionToUser_B_index" ON "_OrchestrionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SpellToUser_AB_unique" ON "_SpellToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SpellToUser_B_index" ON "_SpellToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToUser_AB_unique" ON "_CardToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToUser_B_index" ON "_CardToUser"("B");

-- AddForeignKey
ALTER TABLE "VerminionStats" ADD CONSTRAINT "VerminionStats_minionId_fkey" FOREIGN KEY ("minionId") REFERENCES "Minion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_minionId_fkey" FOREIGN KEY ("minionId") REFERENCES "Minion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_mountId_fkey" FOREIGN KEY ("mountId") REFERENCES "Mount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_spellId_fkey" FOREIGN KEY ("spellId") REFERENCES "Spell"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardStats" ADD CONSTRAINT "CardStats_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinionToUser" ADD CONSTRAINT "_MinionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Minion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinionToUser" ADD CONSTRAINT "_MinionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToUser" ADD CONSTRAINT "_MountToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Mount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToUser" ADD CONSTRAINT "_MountToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToUser" ADD CONSTRAINT "_OrchestrionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Orchestrion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToUser" ADD CONSTRAINT "_OrchestrionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToUser" ADD CONSTRAINT "_SpellToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Spell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToUser" ADD CONSTRAINT "_SpellToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToUser" ADD CONSTRAINT "_CardToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToUser" ADD CONSTRAINT "_CardToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
