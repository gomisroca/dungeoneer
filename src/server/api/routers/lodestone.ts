import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type LodestoneCharacter } from 'types';
import * as cheerio from 'cheerio';

export const lodestoneRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        name: z.string(),
        server: z.string().optional(),
        dc: z.string().optional(),
        page: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const baseUrl = 'https://eu.finalfantasyxiv.com/lodestone/character/';
        const params = new URLSearchParams();

        params.append('q', input.name);
        if (input.server) {
          params.append('worldname', input.server); // If server is provided, use it directly
        } else if (input.dc) {
          params.append('worldname', `_dc_${input.dc}`); // If data center is provided, prefix it
        } else {
          params.append('worldname', ''); // If neither server nor data center is provided, use the default world
        }
        params.append('page', input.page);
        const searchUrl = `${baseUrl}?${params.toString()}`;

        const characterResponse = await fetch(searchUrl);
        const characterHtml = await characterResponse.text();
        const $ = cheerio.load(characterHtml);

        const noResults = $('.parts__zero').length > 0;
        if (noResults) {
          return [];
        }

        const characters = $('.entry')
          .map((_, entry) => {
            const $entry = $(entry);
            const name = $entry.find('.entry__name').text().trim() || '';
            const worldText = $entry.find('.entry__world').text().trim();
            const worldMatch = /(.+?)\s+\[(.+?)\]/.exec(worldText);

            return {
              name,
              avatar: $entry.find('.entry__chara__face > img').attr('src') ?? '',
              id:
                $entry
                  .find('.entry__link')
                  .attr('href')
                  ?.match(/lodestone\/character\/(\d*)\//)?.[1] ?? '',
              server: worldMatch ? worldMatch[1] : '',
              data_center: worldMatch ? worldMatch[2] : '',
            };
          })
          .get() // Convert to an array
          .filter((character) => character.name); // Filter out entries missing name or ID

        // Extract pagination info
        const pagination = {
          current: /\D*(\d+)\D*(\d+)/.exec($('ul.btn__pager > li:nth-child(3)').text())?.[1] ?? '',
          total: /\D*(\d+)\D*(\d+)/.exec($('ul.btn__pager > li:nth-child(3)').text())?.[2] ?? '',
          prev: $('ul.btn__pager > li:nth-child(1) > a:nth-child(1)').attr('href') ?? null,
          next: $('ul.btn__pager > li:nth-child(4) > a:nth-child(1)').attr('href') ?? null,
        };

        return { characters, pagination };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No characters were found', cause: error });
        }
      }
    }),
  character: publicProcedure
    .input(
      z.object({
        lodestoneId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const characterResponse = await fetch(
          `https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/`
        );
        const characterHtml = await characterResponse.text();

        const $char = cheerio.load(characterHtml);

        const character = {
          name: $char('div.frame__chara__box:nth-child(2) > .frame__chara__name').text().trim(),
          avatar: $char('.frame__chara__face > img:nth-child(1)').attr('src'),
          server: /(?<World>\w+)\s+\[(?<DC>\w+)\]/.exec($char('p.frame__chara__world').text())![1],
          data_center: /(?<World>\w+)\s+\[(?<DC>\w+)\]/.exec($char('p.frame__chara__world').text())![2],
        };

        const mountsResponse = await fetch(
          `https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/mount/`
        );
        const mountsHtml = await mountsResponse.text();
        const $mounts = cheerio.load(mountsHtml);
        const mounts = $mounts('.minion__sort__total > span:nth-child(1)').text().trim();
        const dbMounts = await ctx.db.mount.count();

        const minionsResponse = await fetch(
          `https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/minion/`
        );
        const minionsHtml = await minionsResponse.text();
        const $minions = cheerio.load(minionsHtml);
        const minions = $minions('.minion__sort__total > span:nth-child(1)').text().trim();
        const dbMinions = await ctx.db.minion.count();

        return {
          name: character.name,
          avatar: character.avatar,
          server: character.server,
          data_center: character.data_center,
          mounts: {
            count: Number(mounts),
            total: dbMounts,
            public: Number(mounts) > 0,
          },
          minions: {
            count: Number(minions),
            total: dbMinions,
            public: Number(minions) > 0,
          },
        } as LodestoneCharacter;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed to fetch character', cause: error });
        }
      }
    }),
  sync: protectedProcedure
    .input(
      z.object({
        lodestoneId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: {
            id: ctx.session.user.id,
          },
          include: {
            mounts: true,
            minions: true,
          },
        });
        if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

        const mountsResponse = await fetch(
          `https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/mount/`,
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1',
            },
          }
        );
        const mountsHtml = await mountsResponse.text();
        const $mounts = cheerio.load(mountsHtml);

        const mounts = $mounts('.mount__list__item')
          .map((_, mount) => {
            const $mount = $mounts(mount);
            return {
              name: $mount.find('.mount__name').text().trim() || 'Unknown',
            };
          })
          .get();

        const minionsResponse = await fetch(
          `https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/minion/`,
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1',
            },
          }
        );
        const minionsHtml = await minionsResponse.text();
        const $minions = cheerio.load(minionsHtml);

        const minions = $minions('.minion__list__item')
          .map((_, minion) => {
            const $minion = $minions(minion);
            return {
              name: $minion.find('.minion__name').text().trim() || 'Unknown',
            };
          })
          .get();

        // Extract mount and minion names
        const mountNames = mounts.map((mount) => mount.name);
        const minionNames = minions.map((minion) => minion.name);

        // Batch query mounts and minions in a single query each
        const [dbMounts, dbMinions] = await Promise.all([
          ctx.db.mount.findMany({
            where: { name: { in: mountNames } },
            select: { id: true },
          }),
          ctx.db.minion.findMany({
            where: { name: { in: minionNames } },
            select: { id: true },
          }),
        ]);

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

        await ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            mounts: {
              connect: dbMounts.map((mount) => ({ id: mount.id })),
            },
            minions: {
              connect: dbMinions.map((minion) => ({ id: minion.id })),
            },
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed to sync lodestone data' });
        }
      }
    }),
});
