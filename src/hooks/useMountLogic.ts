import { api } from '@/trpc/react';
import { type ExpandedMount } from 'types';
import { addMessage } from '@/app/_components/ui/MessagePopup';

export function useMountLogic(mount: ExpandedMount) {
  const utils = api.useUtils();

  const addToUserMutation = api.mounts.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${mount.name} to your collection.`);
      await utils.mounts.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutation.mutate({ mountId: mount.id });
  };

  const removeFromUserMutation = api.mounts.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${mount.name} from your collection.`);
      await utils.mounts.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutation.mutate({ mountId: mount.id });
  };

  return {
    addToUser,
    removeFromUser,
  };
}
