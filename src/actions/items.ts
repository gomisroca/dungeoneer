import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { itemModelToKey } from '@/utils/mappers';
import { ItemModelName } from 'types';
import { z } from 'zod';

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
    const item = await (trx[model] as any).findUnique({
      where: {
        id: id,
      },
      include: {
        owners: true,
      },
    });
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
    const alreadyOwned = user[relationField].some((i: any) => i.id === item.id);

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
