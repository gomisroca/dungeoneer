import 'server-only';

import { type Prisma } from 'generated/prisma';

import { db } from '@/server/db';

export async function fetchSearchResults(term: string) {
  try {
    const where = {
      OR: [
        {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        },
        {
          minions: {
            some: {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          mounts: {
            some: {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          cards: {
            some: {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          orchestrions: {
            some: {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          spells: {
            some: {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          emotes: {
            some: {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          hairstyles: {
            some: {
              name: {
                contains: term,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    };
    const include = {
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
      cards: {
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
    };

    return db.$transaction(async (trx) => {
      const dungeons = await trx.dungeon.findMany({
        where: where as Prisma.DungeonWhereInput,
        include,
      });

      const raids = await trx.raid.findMany({
        where: where as Prisma.RaidWhereInput,
        include,
      });

      const trials = await trx.trial.findMany({
        where: where as Prisma.TrialWhereInput,
        include,
      });

      const variants = await trx.variantDungeon.findMany({
        where: where as Prisma.VariantDungeonWhereInput,
        include,
      });

      const items = [...dungeons, ...raids, ...trials, ...variants];

      return items;
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Search failed');
    }
  }
}
