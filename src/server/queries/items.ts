import 'server-only';

import { type ItemModelName } from 'types';

import { db } from '@/server/db';
import { cached } from '@/utils/redis';

const include = {
  owners: true,
  sources: true,
};

export async function fetchItems(
  model: ItemModelName,
  { expansion, skip = 0, take = 30 }: { expansion?: string; skip?: number; take?: number }
) {
  const where = expansion ? { patch: { contains: expansion } } : {};
  const cacheKey = `${model}:${expansion ?? 'all'}:${skip}:${take}`;

  const items = await cached(
    cacheKey,
    () =>
      (db[model] as typeof db.minion).findMany({
        orderBy: [{ patch: 'asc' }, { id: 'asc' }],
        where,
        include,
        skip,
        take,
      }),
    60 * 5
  );

  return { items, hasMore: items.length === take };
}
