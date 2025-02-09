import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { CharacterSearch } from '@xivapi/nodestone';
import { type LodestoneCharacter, type LodestoneCollectable } from 'types';

interface NodestoneCharacter {
  ID: number;
  Name: string;
  Avatar: string;
  World: string;
  DC: string;
}

export const lodestoneRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        name: z.string(),
        server: z.string().optional(),
        dc: z.string().optional(),
        page: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const characterSearchParser = new CharacterSearch();

        const query: Record<string, string> = {
          name: input.name,
          ...(input.server && { server: input.server }),
          ...(!input.server && input.dc && { dc: input.dc }),
          ...(input.page > 0 ? { page: input.page.toString() } : {}),
        };

        // @ts-expect-error Nodestone parse
        const characterSearch: {
          List: NodestoneCharacter[];
          Pagination: { Page: number; PageTotal: number; PageNext: number; PagePrev: number };
        } =
          // @ts-expect-error Nodestone parse
          await characterSearchParser.parse({ query });

        return {
          characters: characterSearch.List.map((character) => ({
            id: character.ID,
            name: character.Name,
            avatar: character.Avatar,
            server: character.World,
            data_center: character.DC,
          })) as LodestoneCharacter[],
          pagination: {
            page: characterSearch.Pagination.Page,
            total: characterSearch.Pagination.PageTotal,
            next: characterSearch.Pagination.PageNext,
            prev: characterSearch.Pagination.PagePrev,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No characters were found' });
        }
      }
    }),
  character: publicProcedure
    .input(
      z.object({
        lodestoneId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const url = `https://ffxivcollect.com/api/characters/${input.lodestoneId}`;

        // Fetch all responses in parallel
        const res = await fetch(url);

        // Ensure all responses are OK
        if (!res.ok) {
          throw new Error(`Failed to fetch data. Status codes: ${res.status}`);
        }

        // Parse JSON responses
        const character = (await res.json()) as LodestoneCharacter;

        return {
          name: character.name,
          avatar: character.avatar,
          server: character.server,
          data_center: character.data_center,
          total_mounts: character.total_mounts,
          total_minions: character.total_minions,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Character not found' });
        }
      }
    }),
  sync: publicProcedure
    .input(
      z.object({
        lodestoneId: z.string(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            id: input.userId,
          },
          include: {
            mounts: true,
            minions: true,
          },
        });
        if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

        const urls = [
          `https://ffxivcollect.com/api/characters/${input.lodestoneId}/mounts/owned`,
          `https://ffxivcollect.com/api/characters/${input.lodestoneId}/minions/owned`,
        ];

        // Fetch all responses in parallel
        const responses = await Promise.all(urls.map((url) => fetch(url)));

        // Ensure all responses are OK
        if (responses.some((res) => !res.ok)) {
          throw new Error(`Failed to fetch data. Status codes: ${responses.map((res) => res.status).join(', ')}`);
        }

        // Parse JSON responses
        const mounts = (await responses[1]?.json()) as LodestoneCollectable[];
        const minions = (await responses[2]?.json()) as LodestoneCollectable[];

        // Here we get the localstorage or database data, and we do a process similar to when we sync localstorage to database
        // If collectable is not in collection, add it, if it is and it shouldn't be, remove it
        await ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            mounts: {
              set: [],
            },
            minions: {
              set: [],
            },
          },
        });

        for (const mount of mounts) {
          const dbMount = await ctx.db.mount.findFirst({
            where: {
              name: mount.name,
            },
          });
          if (dbMount) {
            await ctx.db.user.update({
              where: {
                id: user.id,
              },
              data: {
                mounts: {
                  connect: {
                    id: dbMount.id,
                  },
                },
              },
            });
          }
        }

        for (const minion of minions) {
          const dbMinion = await ctx.db.minion.findFirst({
            where: {
              name: minion.name,
            },
          });
          if (dbMinion) {
            await ctx.db.user.update({
              where: {
                id: user.id,
              },
              data: {
                minions: {
                  connect: {
                    id: dbMinion.id,
                  },
                },
              },
            });
          }
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed to sync lodestone data' });
        }
      }
    }),
});
