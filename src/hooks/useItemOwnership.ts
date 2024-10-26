import { useState, useCallback } from 'react';
import { useItemLogic } from './useItemLogic';
import { type Session } from 'next-auth';

interface OwnableItem {
  id: string;
  name: string;
  type: 'cards' | 'minions' | 'mounts' | 'spells' | 'orchestrions' | 'emotes' | 'hairstyles';
  owners: { id: string }[];
}

export function useItemOwnership<T extends OwnableItem>(item: T, session: Session | null) {
  const { addToUser, removeFromUser } = useItemLogic(item);

  const [owned, setOwned] = useState(item.owners.some((owner) => owner.id === session?.user?.id));

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
