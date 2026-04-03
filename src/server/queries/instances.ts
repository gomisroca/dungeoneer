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

const hasCollectibles = {
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

export async function fetchInstances(
  model: InstanceModelName,
  { expansion, skip = 0, take = 30 }: { expansion?: string; skip?: number; take?: number }
) {
  const where = {
    ...hasCollectibles,
    ...(expansion ? { patch: { contains: expansion } } : {}),
  };

  const cacheKey = `${model}:${expansion ?? 'all'}:${skip}:${take}`;

  const instances = await cached(
    cacheKey,
    () =>
      (db[model] as typeof db.dungeon).findMany({
        orderBy: [{ patch: 'asc' }, { id: 'asc' }],
        where,
        include,
        skip,
        take,
      }),
    60 * 5
  );

  return { instances, hasMore: instances.length === take };
}

export async function fetchUniqueInstance(model: InstanceModelName, { id }: { id: number }) {
  const cacheKey = `${model}:${id}`;

  return cached(
    cacheKey,
    () =>
      (db[model] as typeof db.dungeon).findUniqueOrThrow({
        where: { id },
        include,
      }),
    60 * 5
  );
}
