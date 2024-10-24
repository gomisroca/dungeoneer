import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type ExpandedRaid } from 'types';

export const raidsRouter = createTRPCRouter({
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

      const raids: ExpandedRaid[] = await ctx.db.raid.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          OR: [
            { minions: { some: {} } },
            { mounts: { some: {} } },
            { orchestrions: { some: {} } },
            { spells: { some: {} } },
            { cards: { some: {} } },
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
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (raids.length > limit) {
        const nextRaid = raids.pop();
        nextCursor = nextRaid!.id;
      }

      return {
        raids: raids.slice(0, limit),
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
      const raid = await ctx.db.raid.findUnique({
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
        },
      });

      if (!raid) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return raid;
    }),
});
