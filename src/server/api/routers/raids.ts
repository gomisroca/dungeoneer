import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type Raid } from '@prisma/client';

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

      const raids: Raid[] = await ctx.db.raid.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Map over each raid to fetch associated minions, mounts, orchestrions, spells, cards, hairstyles and emotes
      const expandedRaids = await Promise.all(
        raids.map(async (raid) => {
          const minions = await ctx.db.minion.findMany({
            where: {
              sources: {
                some: {
                  type: 'Raid',
                  text: {
                    endsWith: raid.name,
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
                  type: 'Raid',
                  text: {
                    endsWith: raid.name,
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
            ...raid,
            minions,
            mounts,
          };
        })
      );

      let nextCursor: typeof cursor | undefined = undefined;

      if (raids.length > limit) {
        const nextRaid = raids.pop();
        nextCursor = nextRaid!.id;
      }

      return {
        raids: expandedRaids.slice(0, limit),
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
      });

      if (!raid) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const minions = await ctx.db.minion.findMany({
        where: {
          sources: {
            some: {
              type: 'Raid',
              text: {
                endsWith: raid.name,
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
              type: 'Raid',
              text: {
                endsWith: raid.name,
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

      return { ...raid, minions, mounts };
    }),
});
