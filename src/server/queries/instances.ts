import 'server-only';

import { type InstanceModelName } from 'types';

import { db } from '@/server/db';
import { cached } from '@/utils/redis';

const include = {
  minions: { include: { owners: true } },
  mounts: { include: { owners: true } },
  orchestrions: { include: { owners: true } },
  spells: { include: { owners: true } },
  cards: { include: { owners: true } },
  emotes: { include: { owners: true } },
  hairstyles: { include: { owners: true } },
};

export async function fetchInstances(
  model: InstanceModelName,
  {
    expansion,
    skip = 0,
    take = 30,
  }: {
    expansion?: string;
    skip?: number;
    take?: number;
  }
) {
  const where = {
    AND: [{ patch: { contains: expansion } }],
    OR: [
      { minions: { some: {} } },
      { mounts: { some: {} } },
      { orchestrions: { some: {} } },
      { spells: { some: {} } },
      { cards: { some: {} } },
      { emotes: { some: {} } },
      { hairstyles: { some: {} } },
    ],
  };

  const cacheKey = `${model}:${expansion}:${skip}:${take}`;
  const instances = await cached(
    cacheKey,
    async () => {
      try {
        switch (model) {
          case 'dungeon':
            return await db.dungeon.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where,
              include,
              skip,
              take,
            });
          case 'raid':
            return await db.raid.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where,
              include,
              skip,
              take,
            });
          case 'trial':
            return await db.trial.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where,
              include,
              skip,
              take,
            });
          case 'variantDungeon':
            return await db.variantDungeon.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where,
              include,
              skip,
              take,
            });
          default:
            throw new Error(`Unsupported model: ${model as string}`);
        }
      } catch (error) {
        console.error(`Failed to get ${model}s:`, error);
        return null;
      }
    },
    60 * 5 // Cache for 5 minutes
  );

  return { instances, hasMore: Array.isArray(instances) && instances.length === take };
}

export async function fetchUniqueInstance(
  model: InstanceModelName,
  {
    id,
  }: {
    id: number;
  }
) {
  const cacheKey = `${model}:${id}`;
  const instance = await cached(
    cacheKey,
    async () => {
      try {
        switch (model) {
          case 'dungeon':
            return await db.dungeon.findUniqueOrThrow({
              where: {
                id,
              },
              include,
            });
          case 'raid':
            return await db.raid.findUniqueOrThrow({
              where: {
                id,
              },
              include,
            });
          case 'trial':
            return await db.trial.findUniqueOrThrow({
              where: {
                id,
              },
              include,
            });
          case 'variantDungeon':
            return await db.variantDungeon.findUniqueOrThrow({
              where: {
                id,
              },
              include,
            });
          default:
            throw new Error(`Unsupported model: ${model as string}`);
        }
      } catch (error) {
        console.error(`Failed to get ${model}:`, error);
        return null;
      }
    },
    60 * 5 // Cache for 5 minutes
  );

  return instance;
}
