import { type Session } from 'next-auth';
import { useCallback } from 'react';
import { type Item } from 'types';

import { addOrRemoveItem } from '@/actions/items';
import { itemKeytoModel } from '@/utils/mappers';

export function useItemLogic<T extends Item>(item: T, session: Session | null) {
  const isLocalStorage = !session;

  const addOrRemoveFromUser = useCallback(async () => {
    if (isLocalStorage) {
      const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
      const exists = localItems.some((i) => i.id === item.id);
      const updated = exists ? localItems.filter((i) => i.id !== item.id) : [...localItems, item];
      localStorage.setItem('userItems', JSON.stringify(updated));
    } else {
      await addOrRemoveItem(itemKeytoModel[item.type], item.id);
    }
  }, [isLocalStorage, item]);

  return addOrRemoveFromUser;
}
