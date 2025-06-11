import 'server-only';

import { db } from '@server/db';

export async function fetchSearchResults(term: string) {
  try {
    return db.$transaction(async (trx) => {
      const dungeons = await trx.dungeon.findMany({
        where: {
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
        },
      });

      const raids = await trx.raid.findMany({
        where: {
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
        },
      });

      const trials = await trx.trial.findMany({
        where: {
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
        },
      });

      const variants = await trx.variantDungeon.findMany({
        where: {
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
        },
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
