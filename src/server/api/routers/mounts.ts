import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type ExpandedMount } from 'types';

export const mountsRouter = createTRPCRouter({
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
      const mounts: ExpandedMount[] = await ctx.db.mount.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [{ patch: 'asc' }, { id: 'asc' }],
        include: {
          owners: true,
          sources: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;

      if (mounts.length > limit) {
        const nextMount = mounts.pop();
        nextCursor = nextMount!.id;
      }

      return {
        mounts,
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
      const mount = await ctx.db.mount.findUnique({
        where: {
          id: input.id,
        },
        include: {
          owners: true,
        },
      });

      if (!mount) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          mounts: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (user.mounts.find((m) => m.id === mount.id)) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          mounts: {
            connect: {
              id: mount.id,
            },
          },
        },
      });

      await ctx.db.mount.update({
        where: {
          id: mount.id,
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
      const mount = await ctx.db.mount.findUnique({
        where: {
          id: input.id,
        },
        include: {
          owners: true,
        },
      });

      if (!mount) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          mounts: true,
        },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (!user.mounts.find((m) => m.id === mount.id)) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          mounts: {
            disconnect: {
              id: mount.id,
            },
          },
        },
      });

      await ctx.db.mount.update({
        where: {
          id: mount.id,
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
