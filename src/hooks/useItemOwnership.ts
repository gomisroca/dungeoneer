import { useState, useCallback, useEffect } from 'react';
import { useItemLogic } from './useItemLogic';
import { type Session } from 'next-auth';
import { type Item } from 'types';

export function useItemOwnership<T extends Item>(item: T, session: Session | null) {
  const { addToUser, removeFromUser } = useItemLogic(item, session);

  const [owned, setOwned] = useState(false);

  useEffect(() => {
    if (session) {
      setOwned(item.owners.some((owner) => owner.id === session.user?.id));
    } else {
      const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
      setOwned(localItems.some((localItem: Item) => localItem.id === item.id));
      window.dispatchEvent(new Event('storage'));
    }
  }, [item, session]);

  const handleAddOrRemove = useCallback(async () => {
    if (owned) {
      const success = await removeFromUser();
      if (success) {
        setOwned(false);
      }
    } else {
      const success = await addToUser();
      if (success) {
        setOwned(true);
      }
    }
  }, [owned, addToUser, removeFromUser]);

  return {
    owned,
    handleAddOrRemove,
  };
}
