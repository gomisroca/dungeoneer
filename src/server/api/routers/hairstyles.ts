import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type ExpandedHairstyle } from 'types';

export const hairstylesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        expansion: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const hairstyles: ExpandedHairstyle[] = await ctx.db.hairstyle.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ patch: 'asc' }, { id: 'asc' }],
        where: {
          patch: { contains: input.expansion },
        },
        include: {
          owners: true,
          sources: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (hairstyles.length > limit) {
        const nextHairstyle = hairstyles.pop();
        nextCursor = nextHairstyle!.id;
      }

      return {
        items: hairstyles.slice(0, limit),
        nextCursor,
      };
    }),

  addToUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hairstyle = await ctx.db.hairstyle.findUnique({
        where: {
          id: input.id,
        },
        include: {
          owners: true,
        },
      });

      if (!hairstyle) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          hairstyles: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (user.hairstyles.find((m) => m.id === hairstyle.id)) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          hairstyles: {
            connect: {
              id: hairstyle.id,
            },
          },
        },
      });

      await ctx.db.hairstyle.update({
        where: {
          id: hairstyle.id,
        },
        data: {
          owners: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),

  removeFromUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hairstyle = await ctx.db.hairstyle.findUnique({
        where: {
          id: input.id,
        },
        include: {
          owners: true,
        },
      });

      if (!hairstyle) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          hairstyles: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (!user.hairstyles.find((m) => m.id === hairstyle.id)) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          hairstyles: {
            disconnect: {
              id: hairstyle.id,
            },
          },
        },
      });

      await ctx.db.hairstyle.update({
        where: {
          id: hairstyle.id,
        },
        data: {
          owners: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
