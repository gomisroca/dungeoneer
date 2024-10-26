import { api } from '@/trpc/react';
import { addMessage } from '@/app/_components/ui/MessagePopup';
import { type ItemType } from 'types';

interface Item {
  id: string;
  name: string;
  type: ItemType;
}

export function useItemLogic<T extends Item>(item: T) {
  const utils = api.useUtils();
  const addToUserMutation = api[item.type].addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${item.name} to your collection.`);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    try {
      await addToUserMutation.mutateAsync({ id: item.id });
      await utils.invalidate();
      return true;
    } catch (_error) {
      return false;
    }
  };

  const removeFromUserMutation = api[item.type].removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${item.name} from your collection.`);
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    try {
      await removeFromUserMutation.mutateAsync({ id: item.id });
      await utils.invalidate();
      return true;
    } catch (_error) {
      return false;
    }
  };

  return {
    addToUser,
    removeFromUser,
  };
}
