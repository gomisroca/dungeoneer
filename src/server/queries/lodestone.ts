import 'server-only';

import * as cheerio from 'cheerio';
import { type LodestoneCharacter } from 'types';

import { db } from '@/server/db';
import { cached } from '@/utils/redis';

function parseWorldText(text: string) {
  const match = /(?<World>\w+)\s+\[(?<DC>\w+)\]/.exec(text);
  return { server: match?.[1], data_center: match?.[2] };
}

function toError(error: unknown, fallback: string): never {
  throw error instanceof Error ? error : new Error(fallback);
}

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
    const params = new URLSearchParams({ q: name, page });

    if (server) {
      params.append('worldname', server);
    } else if (dc) {
      params.append('worldname', `_dc_${dc}`);
    } else {
      params.append('worldname', '');
    }

    const searchUrl = `https://eu.finalfantasyxiv.com/lodestone/character/?${params.toString()}`;
    const html = await fetch(searchUrl).then((r) => r.text());
    const $ = cheerio.load(html);

    if ($('.parts__zero').length > 0) {
      return { characters: [], pagination: { current: '', total: '', prev: null, next: null } };
    }

    const characters = $('.entry')
      .map((_, entry) => {
        const $entry = $(entry);
        const name = $entry.find('.entry__name').text().trim();
        const { server, data_center } = parseWorldText($entry.find('.entry__world').text().trim());

        return {
          name,
          avatar: $entry.find('.entry__chara__face > img').attr('src') ?? '',
          id:
            $entry
              .find('.entry__link')
              .attr('href')
              ?.match(/lodestone\/character\/(\d*)\//)?.[1] ?? '',
          server,
          data_center,
        };
      })
      .get()
      .filter((c) => c.name);

    const pagerText = $('ul.btn__pager > li:nth-child(3)').text();
    const pagerMatch = /\D*(\d+)\D*(\d+)/.exec(pagerText);

    const pagination = {
      current: pagerMatch?.[1] ?? '',
      total: pagerMatch?.[2] ?? '',
      prev: $('ul.btn__pager > li:nth-child(1) > a:nth-child(1)').attr('href') ?? null,
      next: $('ul.btn__pager > li:nth-child(4) > a:nth-child(1)').attr('href') ?? null,
    };

    return { characters, pagination };
  } catch (error) {
    toError(error, 'No characters were found');
  }
}

export async function fetchUniqueLodestoneCharacter({ lodestoneId }: { lodestoneId: string }) {
  return cached(
    `character:${lodestoneId}`,
    async () => {
      try {
        const baseUrl = `https://eu.finalfantasyxiv.com/lodestone/character/${lodestoneId}`;

        const [charHtml, mountsHtml, minionsHtml, dbMountCount, dbMinionCount] = await Promise.all([
          fetch(`${baseUrl}/`).then((r) => r.text()),
          fetch(`${baseUrl}/mount/`).then((r) => r.text()),
          fetch(`${baseUrl}/minion/`).then((r) => r.text()),
          cached('db:mount:count', () => db.mount.count(), 60 * 60),
          cached('db:minion:count', () => db.minion.count(), 60 * 60),
        ]);

        const $char = cheerio.load(charHtml);
        const { server, data_center } = parseWorldText($char('p.frame__chara__world').text());

        const mountCount = Number(cheerio.load(mountsHtml)('.minion__sort__total > span:nth-child(1)').text().trim());
        const minionCount = Number(cheerio.load(minionsHtml)('.minion__sort__total > span:nth-child(1)').text().trim());

        return {
          id: lodestoneId,
          name: $char('div.frame__chara__box:nth-child(2) > .frame__chara__name').text().trim(),
          avatar: $char('.frame__chara__face > img:nth-child(1)').attr('src'),
          server,
          data_center,
          mounts: {
            count: mountCount,
            total: dbMountCount,
            public: mountCount > 0,
          },
          minions: {
            count: minionCount,
            total: dbMinionCount,
            public: minionCount > 0,
          },
        } as LodestoneCharacter;
      } catch (error) {
        toError(error, 'Failed to fetch character');
      }
    },
    60 * 30
  );
}
