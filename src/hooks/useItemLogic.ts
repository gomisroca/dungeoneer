import { type Session } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { type Item } from 'types';

import { addOrRemoveItem } from '@/actions/items';
import { toErrorMessage } from '@/utils/errors';
import { itemKeytoModel } from '@/utils/mappers';

export function useItemLogic<T extends Item>(item: T, session: Session | null) {
  const [isLocalStorage, setIsLocalStorage] = useState(!session);

  useEffect(() => {
    setIsLocalStorage(!session);
  }, [session]);

  const addOrRemoveFromUser = useCallback(async () => {
    const localAddOrRemove = async (item: Item) => {
      const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
      try {
        if (!localItems.some((localItem: Item) => localItem.id === item.id)) {
          localItems.push(item);
          localStorage.setItem('userItems', JSON.stringify(localItems));
        } else {
          const updatedItems = localItems.filter((localItem: Item) => localItem.id !== item.id);
          localStorage.setItem('userItems', JSON.stringify(updatedItems));
        }
      } catch (error) {
        throw new Error(toErrorMessage(error, `Failed to sync ${item.name}.`));
      }
    };

    const dbAddOrRemove = async (item: Item) => {
      try {
        await addOrRemoveItem(itemKeytoModel[item.type], { id: item.id });
      } catch (error) {
        throw new Error(toErrorMessage(error, `Failed to sync ${item.name}.`));
      }
    };

    if (isLocalStorage) {
      await localAddOrRemove(item);
    } else {
      await dbAddOrRemove(item);
    }
  }, [isLocalStorage, item]);

  return addOrRemoveFromUser;
}
