import 'server-only';

import { type ItemModelName } from 'types';

import { db } from '@/server/db';
import { cached } from '@/utils/redis';

export async function fetchItems(
  model: ItemModelName,
  {
    expansion,
    skip = 0,
    take = 30,
  }: {
    expansion?: string;
    skip?: number;
    take?: number;
  }
) {
  const cacheKey = `${model}:${expansion}:${skip}:${take}`;
  const items = await cached(
    cacheKey,
    async () => {
      try {
        switch (model) {
          case 'minion':
            return await db.minion.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where: {
                patch: { contains: expansion },
              },
              include: {
                owners: true,
                sources: true,
              },
              skip,
              take,
            });
          case 'mount':
            return await db.mount.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where: {
                patch: { contains: expansion },
              },
              include: {
                owners: true,
                sources: true,
              },
              skip,
              take,
            });
          case 'orchestrion':
            return await db.orchestrion.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where: {
                patch: { contains: expansion },
              },
              include: {
                owners: true,
                sources: true,
              },
              skip,
              take,
            });
          case 'spell':
            return await db.spell.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where: {
                patch: { contains: expansion },
              },
              include: {
                owners: true,
                sources: true,
              },
              skip,
              take,
            });
          case 'card':
            return await db.card.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where: {
                patch: { contains: expansion },
              },
              include: {
                owners: true,
                sources: true,
              },
              skip,
              take,
            });
          case 'emote':
            return await db.emote.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where: {
                patch: { contains: expansion },
              },
              include: {
                owners: true,
                sources: true,
              },
              skip,
              take,
            });
          case 'hairstyle':
            return await db.hairstyle.findMany({
              orderBy: [{ patch: 'asc' }, { id: 'asc' }],
              where: {
                patch: { contains: expansion },
              },
              include: {
                owners: true,
                sources: true,
              },
              skip,
              take,
            });
          default:
            throw new Error(`Unsupported model: ${model as string}`);
        }
      } catch (error) {
        console.error(`Failed to get ${model}s:`, error);
        return null;
      }
    },
    60 * 5 // Cache for 5 minutes
  );

  return { items, hasMore: Array.isArray(items) && items.length === take };
}
