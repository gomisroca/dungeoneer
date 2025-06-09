import 'server-only';
import { cached } from '@/utils/redis';
import { db } from '@/server/db';
import { ItemModelName } from 'types';

export async function fetchItems<T extends ItemModelName>(
  model: T,
  {
    limit,
    cursor,
    expansion,
  }: {
    limit?: number;
    cursor?: string;
    expansion?: string;
  }
) {
  const modelDelegate = db[model] as any as {
    findMany: Function;
  };

  const items = await cached(
    `${model}:${expansion}:${limit}:${cursor}`,
    async () => {
      try {
        const items = await modelDelegate.findMany({
          take: limit ? limit + 1 : undefined,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: [{ patch: 'asc' }, { id: 'asc' }],
          where: {
            patch: { contains: expansion },
          },
          include: {
            owners: true,
            sources: true,
          },
        });
        let nextCursor: typeof cursor | undefined = undefined;

        if (limit && items.length > limit) {
          const nextItem = items.pop();
          nextCursor = nextItem!.id;
        }

        return {
          items: items.slice(0, limit),
          nextCursor,
        };
      } catch (error) {
        console.error(`Failed to get ${model}s:`, error);
        return null;
      }
    },
    60 * 5 // Cache for 5 minutes
  );

  return items;
}
