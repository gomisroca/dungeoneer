import { api } from '@/trpc/react';
import { addMessage } from '@/app/_components/ui/MessagePopup';
import { type ItemType } from 'types';
import { useCallback, useEffect, useState } from 'react';
import { type Session } from 'next-auth';

interface Item {
  id: string;
  name: string;
  image: string | null;
  owners: { id: string }[];
  type: ItemType;
}

export function useItemLogic<T extends Item>(item: T, session: Session | null) {
  const utils = api.useUtils();
  const [isLocalStorage, setIsLocalStorage] = useState(!session);

  useEffect(() => {
    setIsLocalStorage(!session);
  }, [session]);

  // tRPC Mutations
  const addToUserMutation = api[item.type].addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${item.name} to your collection.`);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUserMutation = api[item.type].removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${item.name} from your collection.`);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = useCallback(async () => {
    if (isLocalStorage) {
      const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
      if (!localItems.some((localItem: Item) => localItem.id === item.id)) {
        localItems.push(item);
        localStorage.setItem('userItems', JSON.stringify(localItems));
        addMessage(`Added ${item.name} to your local collection.`);
      }
      return true;
    } else {
      try {
        await addToUserMutation.mutateAsync({ id: item.id });
        await utils.invalidate();
        return true;
      } catch (_error) {
        return false;
      }
    }
  }, [isLocalStorage, item, addToUserMutation, utils]);

  const removeFromUser = useCallback(async () => {
    if (isLocalStorage) {
      const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
      const updatedItems = localItems.filter((localItem: Item) => localItem.id !== item.id);
      localStorage.setItem('userItems', JSON.stringify(updatedItems));
      addMessage(`Removed ${item.name} from your local collection.`);
      return true;
    } else {
      try {
        await removeFromUserMutation.mutateAsync({ id: item.id });
        await utils.invalidate();
        return true;
      } catch (_error) {
        return false;
      }
    }
  }, [isLocalStorage, item, removeFromUserMutation, utils]);

  return {
    addToUser,
    removeFromUser,
  };
}
