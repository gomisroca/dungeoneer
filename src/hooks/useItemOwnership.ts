import { type Session } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { type Item } from 'types';

import { useItemLogic } from '@/hooks/useItemLogic';

export function useItemOwnership<T extends Item>(item: T, session: Session | null) {
  const addOrRemoveFromUser = useItemLogic(item, session);

  const [owned, setOwned] = useState(() => {
    if (session) {
      return item.owners.some((owner) => owner.id === session.user?.id);
    }
    try {
      const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
      return localItems.some((i) => i.id === item.id);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (session) {
      setOwned(item.owners.some((owner) => owner.id === session.user?.id));
    }
  }, [item, session]);

  const handleAddOrRemove = useCallback(async () => {
    try {
      await addOrRemoveFromUser();
      setOwned((prev) => !prev);
      if (!session) window.dispatchEvent(new Event('storage'));
    } catch {
      // Don't toggle owned if the action failed
    }
  }, [addOrRemoveFromUser, session]);

  return { owned, handleAddOrRemove };
}
