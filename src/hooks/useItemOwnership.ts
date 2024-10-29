import { useState, useCallback, useEffect } from 'react';
import { useItemLogic } from './useItemLogic';
import { type Session } from 'next-auth';
import { type ItemType } from 'types';

interface OwnableItem {
  id: string;
  name: string;
  image: string | null;
  owners: { id: string }[];
  type: ItemType;
}

export function useItemOwnership<T extends OwnableItem>(item: T, session: Session | null) {
  const { addToUser, removeFromUser } = useItemLogic(item, session);

  const [owned, setOwned] = useState(false);

  useEffect(() => {
    if (session) {
      setOwned(item.owners.some((owner) => owner.id === session.user?.id));
    } else {
      const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as OwnableItem[];
      setOwned(localItems.some((localItem: OwnableItem) => localItem.id === item.id));
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
