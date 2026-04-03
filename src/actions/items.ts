'use server';

import { type ItemModelName } from 'types';

import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { itemModelToKey } from '@/utils/mappers';

export async function addOrRemoveItem(model: ItemModelName, id: string) {
  const session = await auth();
  if (!session?.user) throw new Error('You must be signed in to add an item to your collection');

  if (!id?.trim()) throw new Error('Invalid item ID');

  const relationField = itemModelToKey[model];

  const [item, ownership] = await Promise.all([
    (db[model] as typeof db.minion).findUnique({ where: { id } }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { [relationField]: { where: { id }, select: { id: true } } },
    }),
  ]);

  if (!item) throw new Error(`${model} not found`);
  if (!ownership) throw new Error('User not found');

  const alreadyOwned = (ownership[relationField] as { id: string }[]).length > 0;

  await db.user.update({
    where: { id: session.user.id },
    data: {
      [relationField]: {
        [alreadyOwned ? 'disconnect' : 'connect']: { id },
      },
    },
  });

  return {
    message: `${alreadyOwned ? 'Removed' : 'Added'} ${item.name} ${alreadyOwned ? 'from' : 'to'} your collection.`,
  };
}
