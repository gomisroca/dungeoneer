import { api } from '@/trpc/react';
import { addMessage } from '@/app/_components/ui/MessagePopup';

type ItemType = 'cards' | 'minions' | 'mounts' | 'spells' | 'orchestrions' | 'emotes' | 'hairstyles';
interface Item {
  id: string;
  name: string;
  type: ItemType;
}

export function useItemLogic<T extends Item>(item: T) {
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
