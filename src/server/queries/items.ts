import 'server-only';

import { db } from '@server/db';
import { cached } from '@utils/redis';
import { type ItemModelName } from 'types';

export async function fetchItems<T extends ItemModelName>(
  model: T,
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
  const modelDelegate = db[model] as any as {
    findMany: Function;
  };

  const items = await cached(
    `${model}:${expansion}:${skip}:${take}`,
    async () => {
      try {
        const items = await modelDelegate.findMany({
          orderBy: [{ patch: 'asc' }, { id: 'asc' }],
          where: {
            patch: { contains: expansion },
          },
          include: {
            owners: true,
            sources: true,
          },
          skip,
          take,
        });

        return items;
      } catch (error) {
        console.error(`Failed to get ${model}s:`, error);
        return null;
      }
    },
    60 * 5 // Cache for 5 minutes
  );

  return { items, hasMore: items.length === take };
}
