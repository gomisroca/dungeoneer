import 'server-only';
import { cached } from '@/utils/redis';
import { db } from '@/server/db';

type ModelName = 'dungeon' | 'raid' | 'trial' | 'variantDungeon';

export async function fetchInstances<T extends ModelName>(
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

  const instances = await cached(
    `${model}:${expansion}:${limit}:${cursor}`,
    async () => {
      try {
        const instances = await modelDelegate.findMany({
          take: limit ? limit + 1 : undefined,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: [{ patch: 'asc' }, { id: 'asc' }],
          where: {
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
          },
          include: {
            minions: {
              include: {
                owners: true,
              },
            },
            mounts: {
              include: {
                owners: true,
              },
            },
            orchestrions: {
              include: {
                owners: true,
              },
            },
            spells: {
              include: {
                owners: true,
              },
            },
            cards: {
              include: {
                owners: true,
              },
            },
            emotes: {
              include: {
                owners: true,
              },
            },
            hairstyles: {
              include: {
                owners: true,
              },
            },
          },
        });
        let nextCursor: typeof cursor | undefined = undefined;

        if (limit && instances.length > limit) {
          const nextInstance = instances.pop();
          nextCursor = nextInstance!.id;
        }

        return {
          instances: instances.slice(0, limit),
          nextCursor,
        };
      } catch (error) {
        console.error(`Failed to get ${model}s:`, error);
        return null;
      }
    },
    60 * 5 // Cache for 5 minutes
  );

  return instances;
}

export async function fetchUniqueInstance<T extends ModelName>(
  model: T,
  {
    id,
  }: {
    id: string;
  }
) {
  const modelDelegate = db[model] as any as {
    findUniqueOrThrow: Function;
  };

  const instance = await cached(
    `${model}:${id}`,
    async () => {
      try {
        const instance = await modelDelegate
          .findUniqueOrThrow({
            where: {
              id,
            },
            include: {
              minions: {
                include: {
                  owners: true,
                },
              },
              mounts: {
                include: {
                  owners: true,
                },
              },
              orchestrions: {
                include: {
                  owners: true,
                },
              },
              spells: {
                include: {
                  owners: true,
                },
              },
              cards: {
                include: {
                  owners: true,
                },
              },
              emotes: {
                include: {
                  owners: true,
                },
              },
              hairstyles: {
                include: {
                  owners: true,
                },
              },
            },
          })
          .catch((error: unknown) => {
            console.error(`Failed to get ${model}:`, error);
            return null;
          });

        return instance;
      } catch (error) {
        console.error(`Failed to get ${model}:`, error);
        return null;
      }
    },
    60 * 5 // Cache for 5 minutes
  );

  return instance;
}
