import 'server-only';
import { cached } from '@/utils/redis';
import { type LodestoneCharacter } from 'types';
import * as cheerio from 'cheerio';
import { db } from '@/server/db';

export async function fetchLodestoneCharacters({
  name,
  server,
  dc,
  page,
}: {
  name: string;
  server?: string;
  dc?: string;
  page: string;
}): Promise<{
  characters: LodestoneCharacter[];
  pagination: { current: string; total: string; prev: string | null; next: string | null };
}> {
  try {
    const baseUrl = 'https://eu.finalfantasyxiv.com/lodestone/character/';
    const params = new URLSearchParams();

    params.append('q', name);
    if (server) {
      params.append('worldname', server); // If server is provided, use it directly
    } else if (dc) {
      params.append('worldname', `_dc_${dc}`); // If data center is provided, prefix it
    } else {
      params.append('worldname', ''); // If neither server nor data center is provided, use the default world
    }
    params.append('page', page);
    const searchUrl = `${baseUrl}?${params.toString()}`;

    const characterResponse = await fetch(searchUrl);
    const characterHtml = await characterResponse.text();
    const $ = cheerio.load(characterHtml);

    const noResults = $('.parts__zero').length > 0;
    if (noResults) {
      return { characters: [], pagination: { current: '', total: '', prev: '', next: '' } };
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
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('No characters were found');
    }
  }
}

export async function fetchUniqueLodestoneCharacter({ lodestoneId }: { lodestoneId: string }) {
  const character = await cached(`character:${lodestoneId}`, async () => {
    try {
      const characterResponse = await fetch(`https://eu.finalfantasyxiv.com/lodestone/character/${lodestoneId}/`);
      const characterHtml = await characterResponse.text();

      const $char = cheerio.load(characterHtml);

      const character = {
        name: $char('div.frame__chara__box:nth-child(2) > .frame__chara__name').text().trim(),
        avatar: $char('.frame__chara__face > img:nth-child(1)').attr('src'),
        server: /(?<World>\w+)\s+\[(?<DC>\w+)\]/.exec($char('p.frame__chara__world').text())![1],
        data_center: /(?<World>\w+)\s+\[(?<DC>\w+)\]/.exec($char('p.frame__chara__world').text())![2],
      };

      const mountsResponse = await fetch(`https://eu.finalfantasyxiv.com/lodestone/character/${lodestoneId}/mount/`);
      const mountsHtml = await mountsResponse.text();
      const $mounts = cheerio.load(mountsHtml);
      const mounts = $mounts('.minion__sort__total > span:nth-child(1)').text().trim();
      const dbMounts = await db.mount.count();

      const minionsResponse = await fetch(`https://eu.finalfantasyxiv.com/lodestone/character/${lodestoneId}/minion/`);
      const minionsHtml = await minionsResponse.text();
      const $minions = cheerio.load(minionsHtml);
      const minions = $minions('.minion__sort__total > span:nth-child(1)').text().trim();
      const dbMinions = await db.minion.count();

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
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Failed to fetch character');
      }
    }
  });

  return character;
}
