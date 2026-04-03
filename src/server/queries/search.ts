import 'server-only';

import { type Prisma } from 'generated/prisma';

import { db } from '@/server/db';
import { cached } from '@/utils/redis';

const include = {
  minions: { include: { owners: true } },
  mounts: { include: { owners: true } },
  cards: { include: { owners: true } },
  orchestrions: { include: { owners: true } },
  spells: { include: { owners: true } },
  emotes: { include: { owners: true } },
  hairstyles: { include: { owners: true } },
};

function buildSearchWhere(term: string) {
  const nameMatch = { name: { contains: term, mode: 'insensitive' as const } };
  return {
    OR: [
      nameMatch,
      { minions: { some: nameMatch } },
      { mounts: { some: nameMatch } },
      { cards: { some: nameMatch } },
      { orchestrions: { some: nameMatch } },
      { spells: { some: nameMatch } },
      { emotes: { some: nameMatch } },
      { hairstyles: { some: nameMatch } },
    ],
  };
}

export async function fetchSearchResults(term: string) {
  const trimmed = term.trim();
  if (trimmed.length < 2) return [];

  const cacheKey = `search:${trimmed.toLowerCase()}`;

  return cached(
    cacheKey,
    async () => {
      const where = buildSearchWhere(trimmed);

      const [dungeons, raids, trials, variants] = await Promise.all([
        db.dungeon.findMany({ where: where as Prisma.DungeonWhereInput, include }),
        db.raid.findMany({ where: where as Prisma.RaidWhereInput, include }),
        db.trial.findMany({ where: where as Prisma.TrialWhereInput, include }),
        db.variantDungeon.findMany({ where: where as Prisma.VariantDungeonWhereInput, include }),
      ]);

      return [...dungeons, ...raids, ...trials, ...variants];
    },
    60 * 2
  );
}
