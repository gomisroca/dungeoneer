-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "emoteId" TEXT,
ADD COLUMN     "hairstyleId" TEXT;

-- CreateTable
CREATE TABLE "Hairstyle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "patch" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "image" TEXT,
    "owned" TEXT NOT NULL,

    CONSTRAINT "Hairstyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emote" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patch" TEXT NOT NULL,
    "tradeable" BOOLEAN NOT NULL,
    "image" TEXT,
    "owned" TEXT NOT NULL,

    CONSTRAINT "Emote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantDungeon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "VariantDungeon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trial" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Trial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Raid" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Raid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HairstyleToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EmoteToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HairstyleToUser_AB_unique" ON "_HairstyleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_HairstyleToUser_B_index" ON "_HairstyleToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmoteToUser_AB_unique" ON "_EmoteToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EmoteToUser_B_index" ON "_EmoteToUser"("B");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_emoteId_fkey" FOREIGN KEY ("emoteId") REFERENCES "Emote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_hairstyleId_fkey" FOREIGN KEY ("hairstyleId") REFERENCES "Hairstyle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HairstyleToUser" ADD CONSTRAINT "_HairstyleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Hairstyle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HairstyleToUser" ADD CONSTRAINT "_HairstyleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmoteToUser" ADD CONSTRAINT "_EmoteToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Emote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmoteToUser" ADD CONSTRAINT "_EmoteToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
