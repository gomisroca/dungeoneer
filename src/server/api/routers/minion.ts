import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const minionRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const minions = await ctx.db.minion.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'desc',
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (minions.length > limit) {
        const nextMinion = minions.pop();
        nextCursor = nextMinion!.id;
      }

      return {
        minions,
        nextCursor,
      };
    }),
});
