import { api } from '@/trpc/react';
import { type ExpandedMinion } from 'types';
import { addMessage } from '@/app/_components/ui/MessagePopup';

export function useMinionLogic(minion: ExpandedMinion) {
  const utils = api.useUtils();

  const addToUserMutation = api.minions.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${minion.name} to your collection.`);
      await utils.minions.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutation.mutate({ minionId: minion.id });
  };

  const removeFromUserMutation = api.minions.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${minion.name} from your collection.`);
      await utils.minions.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutation.mutate({ minionId: minion.id });
  };

  return {
    addToUser,
    removeFromUser,
  };
}
