import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const miscRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        term: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const dungeons = await ctx.db.dungeon.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.term,
                  mode: 'insensitive',
                },
              },
              {
                minions: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                mounts: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                cards: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                orchestrions: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                spells: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                emotes: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                hairstyles: {
                  some: {
                    name: {
                      contains: input.term,
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

        const raids = await ctx.db.raid.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.term,
                  mode: 'insensitive',
                },
              },
              {
                minions: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                mounts: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                cards: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                orchestrions: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                spells: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                emotes: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                hairstyles: {
                  some: {
                    name: {
                      contains: input.term,
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

        const trials = await ctx.db.trial.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.term,
                  mode: 'insensitive',
                },
              },
              {
                minions: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                mounts: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                cards: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                orchestrions: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                spells: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                emotes: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                hairstyles: {
                  some: {
                    name: {
                      contains: input.term,
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

        const variants = await ctx.db.variantDungeon.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.term,
                  mode: 'insensitive',
                },
              },
              {
                minions: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                mounts: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                cards: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                orchestrions: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                spells: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                emotes: {
                  some: {
                    name: {
                      contains: input.term,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              {
                hairstyles: {
                  some: {
                    name: {
                      contains: input.term,
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
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Search failed' });
        }
      }
    }),
});
