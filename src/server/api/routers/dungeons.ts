import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type ExpandedDungeon } from 'types';

export const dungeonsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
        expansion: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;

      const dungeons: ExpandedDungeon[] = await ctx.db.dungeon.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ patch: 'asc' }, { id: 'asc' }],
        where: {
          AND: [{ patch: { contains: input.expansion } }],
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

      if (dungeons.length > limit) {
        const nextDungeon = dungeons.pop();
        nextCursor = nextDungeon!.id;
      }

      return {
        items: dungeons.slice(0, limit),
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

      if (!dungeon) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return dungeon;
    }),
});
