import { z } from 'zod';
import * as cheerio from 'cheerio';
import { db } from '@/server/db';
import { auth } from '@/server/auth';

const SyncSchema = z.object({
  lodestoneId: z.string(),
});

export async function syncLodestone(input: z.infer<typeof SyncSchema>) {
  const session = await auth();
  if (!session?.user) throw new Error('You must be signed in to sync your character');

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      mounts: true,
      minions: true,
    },
  });
  if (!user) throw new Error('User not found');

  const mountsResponse = await fetch(`https://eu.finalfantasyxiv.com/lodestone/character/${input.lodestoneId}/mount/`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1',
    },
  });
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

  return await db.$transaction(async (trx) => {
    const dbMounts = await trx.mount.findMany({
      where: { name: { in: mountNames } },
      select: { id: true },
    });

    const dbMinions = await trx.minion.findMany({
      where: { name: { in: minionNames } },
      select: { id: true },
    });

    await trx.user.update({
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

    await trx.user.update({
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

    return {
      message: 'Character synced successfully.',
    };
  });
}
