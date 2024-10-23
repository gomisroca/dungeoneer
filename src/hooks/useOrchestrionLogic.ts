import { api } from '@/trpc/react';
import { type ExpandedOrchestrion } from 'types';
import { addMessage } from '@/app/_components/ui/MessagePopup';

export function useOrchestrionLogic(orchestrion: ExpandedOrchestrion) {
  const utils = api.useUtils();

  const addToUserMutation = api.orchestrions.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${orchestrion.name} to your collection.`);
      await utils.orchestrions.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutation.mutate({ orchestrionId: orchestrion.id });
  };

  const removeFromUserMutation = api.orchestrions.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${orchestrion.name} from your collection.`);
      await utils.orchestrions.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutation.mutate({ orchestrionId: orchestrion.id });
  };

  return {
    addToUser,
    removeFromUser,
  };
}
