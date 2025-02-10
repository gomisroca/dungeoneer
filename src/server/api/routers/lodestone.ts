import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { type LodestoneCharacter } from 'types';
import puppeteer from 'puppeteer';

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
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

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

        await page.goto(searchUrl, {
          waitUntil: 'networkidle2',
        });

        const noResults = await page.$('.parts__zero');
        if (noResults) {
          await browser.close();
          return [];
        }

        let characters = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.entry')).map((entry) => ({
            name: entry.querySelector('.entry__name')?.textContent?.trim() ?? 'Unknown',
            avatar: entry.querySelector('.entry__chara__face > img')?.getAttribute('src') ?? '',
            id:
              entry
                .querySelector('.entry__link')
                ?.getAttribute('href')
                ?.match(/lodestone\/character\/(\d*)\//)?.[1] ?? '',
            world: entry.querySelector('.entry__world')?.textContent?.match(/(\w*)\s+\[(\w*)\]/)![1],
            dataCenter: entry.querySelector('.entry__world')?.textContent?.match(/(\w*)\s+\[(\w*)\]/)![2],
          }));
        });
        characters = characters.filter((character) => character.name.toLowerCase().includes(input.name.toLowerCase()));

        const pagination = await page.evaluate(() => {
          return {
            current: document
              .querySelector('ul.btn__pager > li:nth-child(3)')
              ?.textContent?.match(/\D*(\d+)\D*(\d+)/)![1],
            total: document
              .querySelector('ul.btn__pager > li:nth-child(3)')
              ?.textContent?.match(/\D*(\d+)\D*(\d+)/)![2],
            prev: document.querySelector('ul.btn__pager > li:nth-child(1) > a:nth-child(1)')?.getAttribute('href'),
            next: document.querySelector('ul.btn__pager > li:nth-child(4) > a:nth-child(1)')?.getAttribute('href'),
          };
        });

        await browser.close();
        return {
          characters: characters.map((character) => ({
            id: character.id,
            name: character.name,
            avatar: character.avatar,
            server: character.world,
            data_center: character.dataCenter,
          })),
          pagination: {
            current: pagination.current,
            total: pagination.total,
            next: pagination.next,
            prev: pagination.prev,
          },
        } as {
          characters: LodestoneCharacter[];
          pagination: {
            current: string;
            total: string;
            next: string | null;
            prev: string | null;
          };
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
    .query(async ({ input, ctx }) => {
      try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(`https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/`, {
          waitUntil: 'networkidle2',
        });
        const character = await page.evaluate(() => {
          return {
            name:
              document.querySelector('div.frame__chara__box:nth-child(2) > .frame__chara__name')?.textContent?.trim() ??
              'Unknown',
            avatar: document.querySelector('.frame__chara__face > img:nth-child(1)')?.getAttribute('src') ?? '',
            server:
              document
                .querySelector('p.frame__chara__world')
                ?.textContent?.match(/(?<World>\w+)\s+\[(?<DC>\w+)\]/)![1] ?? 'Unknown',
            data_center:
              document
                .querySelector('p.frame__chara__world')
                ?.textContent?.match(/(?<World>\w+)\s+\[(?<DC>\w+)\]/)![2] ?? 'Unknown',
          };
        });

        await page.setUserAgent(
          'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1'
        );
        // Navigate the page to target website
        await page.goto(`https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/mount/`, {
          waitUntil: 'networkidle2',
        });

        // Get the text content of the page's body
        const dbMounts = await ctx.db.mount.count();
        const mounts = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.mount__list__item')).map((mount) => ({
            name: mount.querySelector('.mount__name')?.textContent?.trim() ?? 'Unknown',
          }));
        });

        // Navigate the page to target website
        await page.goto(`https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/minion/`, {
          waitUntil: 'networkidle2',
        });

        const dbMinions = await ctx.db.minion.count();
        const minions = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.minion__list__item')).map((minion) => ({
            name: minion.querySelector('.minion__name')?.textContent?.trim() ?? 'Unknown',
          }));
        });

        // Close the browser
        await browser.close();

        return {
          name: character.name,
          avatar: character.avatar,
          server: character.server,
          data_center: character.data_center,
          mounts: {
            count: mounts.length,
            total: dbMounts,
            public: mounts.length > 0,
          },
          minions: {
            count: minions.length,
            total: dbMinions,
            public: minions.length > 0,
          },
        } as LodestoneCharacter;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed to fetch character' });
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

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setUserAgent(
          'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1'
        );
        // Navigate the page to target website
        await page.goto(`https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/mount/`, {
          waitUntil: 'networkidle2',
        });
        const mounts = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.mount__list__item')).map((mount) => ({
            name: mount.querySelector('.mount__name')?.textContent?.trim() ?? 'Unknown',
          }));
        });

        // Navigate the page to target website
        await page.goto(`https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/minion/`, {
          waitUntil: 'networkidle2',
        });

        const minions = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.minion__list__item')).map((minion) => ({
            name: minion.querySelector('.minion__name')?.textContent?.trim() ?? 'Unknown',
          }));
        });

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

        await browser.close();
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Failed to sync lodestone data' });
        }
      }
    }),
});
