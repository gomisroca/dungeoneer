import { type Session } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { type Item } from 'types';

import { addOrRemoveItem } from '@/actions/items';
import { useMessage } from '@/hooks/useMessage';
import { toErrorMessage } from '@/utils/errors';
import { itemKeytoModel } from '@/utils/mappers';

export function useItemLogic<T extends Item>(item: T, session: Session | null) {
  const setMessage = useMessage();
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
          setMessage({ content: `Added ${item.name} to your local collection.` });
        } else {
          const updatedItems = localItems.filter((localItem: Item) => localItem.id !== item.id);
          localStorage.setItem('userItems', JSON.stringify(updatedItems));
          setMessage({ content: `Removed ${item.name} from your local collection.` });
        }
      } catch (error) {
        setMessage({
          content: toErrorMessage(error, `Failed to sync ${item.name}.`),
          error: true,
        });
      }
    };

    const dbAddOrRemove = async (item: Item) => {
      try {
        const action = await addOrRemoveItem(itemKeytoModel[item.type], { id: item.id });
        setMessage({ content: action.message });
      } catch (error) {
        setMessage({
          content: toErrorMessage(error, `Failed to sync ${item.name}.`),
          error: true,
        });
      }
    };

    if (isLocalStorage) {
      await localAddOrRemove(item);
    } else {
      await dbAddOrRemove(item);
    }
  }, [isLocalStorage, item, setMessage]);

  return addOrRemoveFromUser;
}
