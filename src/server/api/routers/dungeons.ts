import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type Dungeon } from '@prisma/client';

export const dungeonsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const dungeonsWithExtras = [];
      let nextCursor = cursor;

      // Loop to keep fetching dungeons until we fill up to the limit
      while (dungeonsWithExtras.length < limit) {
        // Fetch a batch of dungeons with pagination
        const dungeons: Dungeon[] = await ctx.db.dungeon.findMany({
          take: limit + 1, // Fetch limit + 1 to determine the next cursor
          cursor: nextCursor ? { id: nextCursor } : undefined,
        });

        if (dungeons.length === 0) {
          break; // No more dungeons to fetch
        }

        // Map over each dungeon to fetch associated minions and mounts
        const expandedDungeons = await Promise.all(
          dungeons.map(async (dungeon) => {
            const minions = await ctx.db.minion.findMany({
              where: {
                sources: {
                  some: {
                    type: 'Dungeon',
                    text: {
                      contains: dungeon.name,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              include: {
                sources: true,
                owners: true,
              },
            });

            const mounts = await ctx.db.mount.findMany({
              where: {
                sources: {
                  some: {
                    type: 'Dungeon',
                    text: {
                      contains: dungeon.name,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              include: {
                sources: true,
                owners: true,
              },
            });

            const orchestrions = await ctx.db.orchestrion.findMany({
              where: {
                sources: {
                  some: {
                    text: {
                      contains: dungeon.name,
                      mode: 'insensitive',
                    },
                  },
                },
              },
              include: {
                sources: true,
                owners: true,
              },
            });

            // Only return dungeons that have either minions or mounts
            if (minions.length > 0 || mounts.length > 0) {
              return {
                ...dungeon,
                minions,
                mounts,
                orchestrions,
              };
            }

            return null; // Return null if no minions or mounts
          })
        );

        // Filter out null values (dungeons without minions or mounts)
        const filteredDungeons = expandedDungeons.filter((dungeon) => dungeon !== null);

        // Add the filtered dungeons to the result set
        dungeonsWithExtras.push(...filteredDungeons);

        // Update nextCursor for pagination if needed
        if (dungeons.length > limit) {
          const nextDungeon = dungeons.pop(); // Remove the extra dungeon used for pagination
          nextCursor = nextDungeon!.id; // Set nextCursor for the next batch
        } else {
          nextCursor = undefined; // No more dungeons to fetch
        }

        // Stop if we've exhausted all dungeons
        if (!nextCursor) {
          break;
        }
      }

      // Ensure we return no more than the requested limit
      return {
        dungeons: dungeonsWithExtras.slice(0, limit), // Slice to the exact limit
        nextCursor,
      };
    }),

  getUnique: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const dungeon = await ctx.db.dungeon.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!dungeon) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const minions = await ctx.db.minion.findMany({
        where: {
          sources: {
            some: {
              type: 'Dungeon',
              text: {
                contains: dungeon.name,
                mode: 'insensitive', // Optional: to make the search case-insensitive
              },
            },
          },
        },
        include: {
          sources: true,
          owners: true,
        },
      });

      const mounts = await ctx.db.mount.findMany({
        where: {
          sources: {
            some: {
              type: 'Dungeon',
              text: {
                contains: dungeon.name,
                mode: 'insensitive',
              },
            },
          },
        },
        include: {
          sources: true,
          owners: true,
        },
      });

      const orchestrions = await ctx.db.orchestrion.findMany({
        where: {
          sources: {
            some: {
              text: {
                contains: dungeon.name,
                mode: 'insensitive',
              },
            },
          },
        },
        include: {
          sources: true,
          owners: true,
        },
      });

      return { ...dungeon, minions, mounts, orchestrions };
    }),
});
