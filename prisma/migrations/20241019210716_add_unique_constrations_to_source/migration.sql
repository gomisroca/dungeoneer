/*
  Warnings:

  - A unique constraint covering the columns `[minionId]` on the table `Source` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mountId]` on the table `Source` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spellId]` on the table `Source` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cardId]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Source_minionId_key" ON "Source"("minionId");

-- CreateIndex
CREATE UNIQUE INDEX "Source_mountId_key" ON "Source"("mountId");

-- CreateIndex
CREATE UNIQUE INDEX "Source_spellId_key" ON "Source"("spellId");

-- CreateIndex
CREATE UNIQUE INDEX "Source_cardId_key" ON "Source"("cardId");
