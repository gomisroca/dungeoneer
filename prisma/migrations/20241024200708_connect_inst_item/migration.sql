-- CreateTable
CREATE TABLE "_MinionToVariantDungeon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MinionToTrial" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MinionToRaid" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MountToVariantDungeon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MountToTrial" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MountToRaid" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OrchestrionToVariantDungeon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OrchestrionToTrial" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OrchestrionToRaid" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SpellToVariantDungeon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SpellToTrial" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CardToDungeon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CardToVariantDungeon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CardToTrial" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CardToRaid" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_HairstyleToVariantDungeon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_HairstyleToTrial" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_HairstyleToRaid" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EmoteToVariantDungeon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EmoteToTrial" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EmoteToRaid" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DungeonToMinion" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DungeonToMount" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DungeonToOrchestrion" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DungeonToSpell" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DungeonToHairstyle" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DungeonToEmote" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_RaidToSpell" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MinionToVariantDungeon_AB_unique" ON "_MinionToVariantDungeon"("A", "B");

-- CreateIndex
CREATE INDEX "_MinionToVariantDungeon_B_index" ON "_MinionToVariantDungeon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MinionToTrial_AB_unique" ON "_MinionToTrial"("A", "B");

-- CreateIndex
CREATE INDEX "_MinionToTrial_B_index" ON "_MinionToTrial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MinionToRaid_AB_unique" ON "_MinionToRaid"("A", "B");

-- CreateIndex
CREATE INDEX "_MinionToRaid_B_index" ON "_MinionToRaid"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MountToVariantDungeon_AB_unique" ON "_MountToVariantDungeon"("A", "B");

-- CreateIndex
CREATE INDEX "_MountToVariantDungeon_B_index" ON "_MountToVariantDungeon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MountToTrial_AB_unique" ON "_MountToTrial"("A", "B");

-- CreateIndex
CREATE INDEX "_MountToTrial_B_index" ON "_MountToTrial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MountToRaid_AB_unique" ON "_MountToRaid"("A", "B");

-- CreateIndex
CREATE INDEX "_MountToRaid_B_index" ON "_MountToRaid"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrchestrionToVariantDungeon_AB_unique" ON "_OrchestrionToVariantDungeon"("A", "B");

-- CreateIndex
CREATE INDEX "_OrchestrionToVariantDungeon_B_index" ON "_OrchestrionToVariantDungeon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrchestrionToTrial_AB_unique" ON "_OrchestrionToTrial"("A", "B");

-- CreateIndex
CREATE INDEX "_OrchestrionToTrial_B_index" ON "_OrchestrionToTrial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrchestrionToRaid_AB_unique" ON "_OrchestrionToRaid"("A", "B");

-- CreateIndex
CREATE INDEX "_OrchestrionToRaid_B_index" ON "_OrchestrionToRaid"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SpellToVariantDungeon_AB_unique" ON "_SpellToVariantDungeon"("A", "B");

-- CreateIndex
CREATE INDEX "_SpellToVariantDungeon_B_index" ON "_SpellToVariantDungeon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SpellToTrial_AB_unique" ON "_SpellToTrial"("A", "B");

-- CreateIndex
CREATE INDEX "_SpellToTrial_B_index" ON "_SpellToTrial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToDungeon_AB_unique" ON "_CardToDungeon"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToDungeon_B_index" ON "_CardToDungeon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToVariantDungeon_AB_unique" ON "_CardToVariantDungeon"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToVariantDungeon_B_index" ON "_CardToVariantDungeon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToTrial_AB_unique" ON "_CardToTrial"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToTrial_B_index" ON "_CardToTrial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToRaid_AB_unique" ON "_CardToRaid"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToRaid_B_index" ON "_CardToRaid"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HairstyleToVariantDungeon_AB_unique" ON "_HairstyleToVariantDungeon"("A", "B");

-- CreateIndex
CREATE INDEX "_HairstyleToVariantDungeon_B_index" ON "_HairstyleToVariantDungeon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HairstyleToTrial_AB_unique" ON "_HairstyleToTrial"("A", "B");

-- CreateIndex
CREATE INDEX "_HairstyleToTrial_B_index" ON "_HairstyleToTrial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HairstyleToRaid_AB_unique" ON "_HairstyleToRaid"("A", "B");

-- CreateIndex
CREATE INDEX "_HairstyleToRaid_B_index" ON "_HairstyleToRaid"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmoteToVariantDungeon_AB_unique" ON "_EmoteToVariantDungeon"("A", "B");

-- CreateIndex
CREATE INDEX "_EmoteToVariantDungeon_B_index" ON "_EmoteToVariantDungeon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmoteToTrial_AB_unique" ON "_EmoteToTrial"("A", "B");

-- CreateIndex
CREATE INDEX "_EmoteToTrial_B_index" ON "_EmoteToTrial"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmoteToRaid_AB_unique" ON "_EmoteToRaid"("A", "B");

-- CreateIndex
CREATE INDEX "_EmoteToRaid_B_index" ON "_EmoteToRaid"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DungeonToMinion_AB_unique" ON "_DungeonToMinion"("A", "B");

-- CreateIndex
CREATE INDEX "_DungeonToMinion_B_index" ON "_DungeonToMinion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DungeonToMount_AB_unique" ON "_DungeonToMount"("A", "B");

-- CreateIndex
CREATE INDEX "_DungeonToMount_B_index" ON "_DungeonToMount"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DungeonToOrchestrion_AB_unique" ON "_DungeonToOrchestrion"("A", "B");

-- CreateIndex
CREATE INDEX "_DungeonToOrchestrion_B_index" ON "_DungeonToOrchestrion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DungeonToSpell_AB_unique" ON "_DungeonToSpell"("A", "B");

-- CreateIndex
CREATE INDEX "_DungeonToSpell_B_index" ON "_DungeonToSpell"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DungeonToHairstyle_AB_unique" ON "_DungeonToHairstyle"("A", "B");

-- CreateIndex
CREATE INDEX "_DungeonToHairstyle_B_index" ON "_DungeonToHairstyle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DungeonToEmote_AB_unique" ON "_DungeonToEmote"("A", "B");

-- CreateIndex
CREATE INDEX "_DungeonToEmote_B_index" ON "_DungeonToEmote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RaidToSpell_AB_unique" ON "_RaidToSpell"("A", "B");

-- CreateIndex
CREATE INDEX "_RaidToSpell_B_index" ON "_RaidToSpell"("B");

-- AddForeignKey
ALTER TABLE "_MinionToVariantDungeon" ADD CONSTRAINT "_MinionToVariantDungeon_A_fkey" FOREIGN KEY ("A") REFERENCES "Minion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinionToVariantDungeon" ADD CONSTRAINT "_MinionToVariantDungeon_B_fkey" FOREIGN KEY ("B") REFERENCES "VariantDungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinionToTrial" ADD CONSTRAINT "_MinionToTrial_A_fkey" FOREIGN KEY ("A") REFERENCES "Minion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinionToTrial" ADD CONSTRAINT "_MinionToTrial_B_fkey" FOREIGN KEY ("B") REFERENCES "Trial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinionToRaid" ADD CONSTRAINT "_MinionToRaid_A_fkey" FOREIGN KEY ("A") REFERENCES "Minion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MinionToRaid" ADD CONSTRAINT "_MinionToRaid_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToVariantDungeon" ADD CONSTRAINT "_MountToVariantDungeon_A_fkey" FOREIGN KEY ("A") REFERENCES "Mount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToVariantDungeon" ADD CONSTRAINT "_MountToVariantDungeon_B_fkey" FOREIGN KEY ("B") REFERENCES "VariantDungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToTrial" ADD CONSTRAINT "_MountToTrial_A_fkey" FOREIGN KEY ("A") REFERENCES "Mount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToTrial" ADD CONSTRAINT "_MountToTrial_B_fkey" FOREIGN KEY ("B") REFERENCES "Trial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToRaid" ADD CONSTRAINT "_MountToRaid_A_fkey" FOREIGN KEY ("A") REFERENCES "Mount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MountToRaid" ADD CONSTRAINT "_MountToRaid_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToVariantDungeon" ADD CONSTRAINT "_OrchestrionToVariantDungeon_A_fkey" FOREIGN KEY ("A") REFERENCES "Orchestrion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToVariantDungeon" ADD CONSTRAINT "_OrchestrionToVariantDungeon_B_fkey" FOREIGN KEY ("B") REFERENCES "VariantDungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToTrial" ADD CONSTRAINT "_OrchestrionToTrial_A_fkey" FOREIGN KEY ("A") REFERENCES "Orchestrion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToTrial" ADD CONSTRAINT "_OrchestrionToTrial_B_fkey" FOREIGN KEY ("B") REFERENCES "Trial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToRaid" ADD CONSTRAINT "_OrchestrionToRaid_A_fkey" FOREIGN KEY ("A") REFERENCES "Orchestrion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrchestrionToRaid" ADD CONSTRAINT "_OrchestrionToRaid_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToVariantDungeon" ADD CONSTRAINT "_SpellToVariantDungeon_A_fkey" FOREIGN KEY ("A") REFERENCES "Spell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToVariantDungeon" ADD CONSTRAINT "_SpellToVariantDungeon_B_fkey" FOREIGN KEY ("B") REFERENCES "VariantDungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToTrial" ADD CONSTRAINT "_SpellToTrial_A_fkey" FOREIGN KEY ("A") REFERENCES "Spell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpellToTrial" ADD CONSTRAINT "_SpellToTrial_B_fkey" FOREIGN KEY ("B") REFERENCES "Trial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToDungeon" ADD CONSTRAINT "_CardToDungeon_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToDungeon" ADD CONSTRAINT "_CardToDungeon_B_fkey" FOREIGN KEY ("B") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToVariantDungeon" ADD CONSTRAINT "_CardToVariantDungeon_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToVariantDungeon" ADD CONSTRAINT "_CardToVariantDungeon_B_fkey" FOREIGN KEY ("B") REFERENCES "VariantDungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToTrial" ADD CONSTRAINT "_CardToTrial_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToTrial" ADD CONSTRAINT "_CardToTrial_B_fkey" FOREIGN KEY ("B") REFERENCES "Trial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToRaid" ADD CONSTRAINT "_CardToRaid_A_fkey" FOREIGN KEY ("A") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToRaid" ADD CONSTRAINT "_CardToRaid_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HairstyleToVariantDungeon" ADD CONSTRAINT "_HairstyleToVariantDungeon_A_fkey" FOREIGN KEY ("A") REFERENCES "Hairstyle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HairstyleToVariantDungeon" ADD CONSTRAINT "_HairstyleToVariantDungeon_B_fkey" FOREIGN KEY ("B") REFERENCES "VariantDungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HairstyleToTrial" ADD CONSTRAINT "_HairstyleToTrial_A_fkey" FOREIGN KEY ("A") REFERENCES "Hairstyle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HairstyleToTrial" ADD CONSTRAINT "_HairstyleToTrial_B_fkey" FOREIGN KEY ("B") REFERENCES "Trial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HairstyleToRaid" ADD CONSTRAINT "_HairstyleToRaid_A_fkey" FOREIGN KEY ("A") REFERENCES "Hairstyle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HairstyleToRaid" ADD CONSTRAINT "_HairstyleToRaid_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmoteToVariantDungeon" ADD CONSTRAINT "_EmoteToVariantDungeon_A_fkey" FOREIGN KEY ("A") REFERENCES "Emote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmoteToVariantDungeon" ADD CONSTRAINT "_EmoteToVariantDungeon_B_fkey" FOREIGN KEY ("B") REFERENCES "VariantDungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmoteToTrial" ADD CONSTRAINT "_EmoteToTrial_A_fkey" FOREIGN KEY ("A") REFERENCES "Emote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmoteToTrial" ADD CONSTRAINT "_EmoteToTrial_B_fkey" FOREIGN KEY ("B") REFERENCES "Trial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmoteToRaid" ADD CONSTRAINT "_EmoteToRaid_A_fkey" FOREIGN KEY ("A") REFERENCES "Emote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmoteToRaid" ADD CONSTRAINT "_EmoteToRaid_B_fkey" FOREIGN KEY ("B") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToMinion" ADD CONSTRAINT "_DungeonToMinion_A_fkey" FOREIGN KEY ("A") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToMinion" ADD CONSTRAINT "_DungeonToMinion_B_fkey" FOREIGN KEY ("B") REFERENCES "Minion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToMount" ADD CONSTRAINT "_DungeonToMount_A_fkey" FOREIGN KEY ("A") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToMount" ADD CONSTRAINT "_DungeonToMount_B_fkey" FOREIGN KEY ("B") REFERENCES "Mount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToOrchestrion" ADD CONSTRAINT "_DungeonToOrchestrion_A_fkey" FOREIGN KEY ("A") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToOrchestrion" ADD CONSTRAINT "_DungeonToOrchestrion_B_fkey" FOREIGN KEY ("B") REFERENCES "Orchestrion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToSpell" ADD CONSTRAINT "_DungeonToSpell_A_fkey" FOREIGN KEY ("A") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToSpell" ADD CONSTRAINT "_DungeonToSpell_B_fkey" FOREIGN KEY ("B") REFERENCES "Spell"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToHairstyle" ADD CONSTRAINT "_DungeonToHairstyle_A_fkey" FOREIGN KEY ("A") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToHairstyle" ADD CONSTRAINT "_DungeonToHairstyle_B_fkey" FOREIGN KEY ("B") REFERENCES "Hairstyle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToEmote" ADD CONSTRAINT "_DungeonToEmote_A_fkey" FOREIGN KEY ("A") REFERENCES "Dungeon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DungeonToEmote" ADD CONSTRAINT "_DungeonToEmote_B_fkey" FOREIGN KEY ("B") REFERENCES "Emote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RaidToSpell" ADD CONSTRAINT "_RaidToSpell_A_fkey" FOREIGN KEY ("A") REFERENCES "Raid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RaidToSpell" ADD CONSTRAINT "_RaidToSpell_B_fkey" FOREIGN KEY ("B") REFERENCES "Spell"("id") ON DELETE CASCADE ON UPDATE CASCADE;
