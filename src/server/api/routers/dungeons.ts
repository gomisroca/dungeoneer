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

      const dungeons: Dungeon[] = await ctx.db.dungeon.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Map over each dungeon to fetch associated minions
      const dungeonsWithMinions = await Promise.all(
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
          return {
            ...dungeon,
            minions,
          };
        })
      );

      let nextCursor: typeof cursor | undefined = undefined;

      if (dungeons.length > limit) {
        const nextDungeon = dungeons.pop();
        nextCursor = nextDungeon!.id;
      }

      return {
        dungeons: dungeonsWithMinions.slice(0, limit),
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

      return { ...dungeon, minions };
    }),
});
