import { type Session } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { type Item } from 'types';

import { useItemLogic } from '@/hooks/useItemLogic';

export function useItemOwnership<T extends Item>(item: T, session: Session | null) {
  const addOrRemoveFromUser = useItemLogic(item, session);

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
    await addOrRemoveFromUser();
    owned ? setOwned(false) : setOwned(true);
  }, [owned, addOrRemoveFromUser]);

  return {
    owned,
    handleAddOrRemove,
  };
}
