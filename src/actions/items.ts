'use server';

import { type ItemModelName } from 'types';
import { z } from 'zod';

import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { itemModelToKey } from '@/utils/mappers';

const ItemSchema = z.object({
  id: z.string(),
});
export async function addOrRemoveItem<T extends ItemModelName>(model: T, createData: z.infer<typeof ItemSchema>) {
  const session = await auth();
  if (!session?.user) throw new Error('You must be signed in to add an item to a character');

  const validatedFields = ItemSchema.safeParse({
    id: createData.id,
  });
  if (!validatedFields.success) throw new Error(validatedFields.error.toString());
  const { id } = validatedFields.data;

  const relationField = itemModelToKey[model];

  return await db.$transaction(async (trx) => {
    let item: { id: string; name: string } | null = null;
    switch (model) {
      case 'card':
        item = await trx.card.findUnique({ where: { id }, include: { owners: true } });
        break;
      case 'emote':
        item = await trx.emote.findUnique({ where: { id }, include: { owners: true } });
        break;
      case 'minion':
        item = await trx.minion.findUnique({ where: { id }, include: { owners: true } });
        break;
      case 'mount':
        item = await trx.mount.findUnique({ where: { id }, include: { owners: true } });
        break;
      case 'hairstyle':
        item = await trx.hairstyle.findUnique({ where: { id }, include: { owners: true } });
        break;
      case 'orchestrion':
        item = await trx.orchestrion.findUnique({ where: { id }, include: { owners: true } });
        break;
      case 'spell':
        item = await trx.spell.findUnique({ where: { id }, include: { owners: true } });
        break;
      default:
        throw new Error(`Unsupported model: ${model}`);
    }
    if (!item) throw new Error(`${model} not found`);

    const user = await trx.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        [relationField]: true,
      },
    });
    if (!user || !user[relationField]) throw new Error('User not found or missing collection');

    const alreadyOwned = user[relationField].some((i) => i.id === item.id);

    await trx.user.update({
      where: { id: session.user.id },
      data: {
        [relationField]: {
          [alreadyOwned ? 'disconnect' : 'connect']: { id: item.id },
        },
      },
    });

    return {
      message: `${alreadyOwned ? 'Removed' : 'Added'} ${item.name} ${alreadyOwned ? 'from' : 'to'} your collection.`,
    };
  });
}

// Example Usage
// try {
//   // Optimistically set the message
//   setMessage({
//     content: `Group ${(formData.get('name') as string).trim()} was created.`
//   });
//   // Execute the server action
//   await addOrRemoveItem(formData);
// } catch ( error) {
//   // If there was an error during the action, set the error message
//   setMessage({
//     content: toErrorMessage(error, 'Failed to create group'),
//     error: true,
//   });
// }
