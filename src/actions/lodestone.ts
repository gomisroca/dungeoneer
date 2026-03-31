'use server';

import * as cheerio from 'cheerio';

import { auth } from '@/server/auth';
import { db } from '@/server/db';

const LODESTONE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1';

async function fetchLodestoneNames(lodestoneId: string, type: 'mount' | 'minion'): Promise<string[]> {
  const url = `https://eu.finalfantasyxiv.com/lodestone/character/${lodestoneId}/${type}/`;
  const html = await fetch(url, { headers: { 'User-Agent': LODESTONE_USER_AGENT } }).then((r) => r.text());
  const $ = cheerio.load(html);

  return $(`.${type}__list__item`)
    .map((_, el) => $(el).find(`.${type}__name`).text().trim())
    .get()
    .filter(Boolean);
}

export async function syncLodestone({ lodestoneId }: { lodestoneId: string }) {
  const session = await auth();
  if (!session?.user) throw new Error('You must be signed in to sync your character');

  const [user, mountNames, minionNames] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id }, select: { id: true } }),
    fetchLodestoneNames(lodestoneId, 'mount'),
    fetchLodestoneNames(lodestoneId, 'minion'),
  ]);

  if (!user) throw new Error('User not found');

  const [dbMounts, dbMinions] = await Promise.all([
    db.mount.findMany({ where: { name: { in: mountNames } }, select: { id: true } }),
    db.minion.findMany({ where: { name: { in: minionNames } }, select: { id: true } }),
  ]);

  await db.user.update({
    where: { id: user.id },
    data: {
      mounts: { set: dbMounts.map((m) => ({ id: m.id })) },
      minions: { set: dbMinions.map((m) => ({ id: m.id })) },
    },
  });

  return { message: 'Character synced successfully.' };
}
