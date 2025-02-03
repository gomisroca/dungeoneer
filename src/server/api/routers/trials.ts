import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type ExpandedTrial } from 'types';

export const trialsRouter = createTRPCRouter({
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

      const trials: ExpandedTrial[] = await ctx.db.trial.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ patch: 'asc' }, { id: 'asc' }],
        where: {
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

      if (trials.length > limit) {
        const nextTrial = trials.pop();
        nextCursor = nextTrial!.id;
      }

      return {
        items: trials.slice(0, limit),
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
      const trial = await ctx.db.trial.findUnique({
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

      if (!trial) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return trial;
    }),
});
