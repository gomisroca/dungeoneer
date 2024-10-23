import { api } from '@/trpc/react';
import { type ExpandedMount } from 'types';
import { addMessage } from '@/app/_components/ui/MessagePopup';
import { signal } from '@preact-signals/safe-react';

export const mountsInLS = signal<string[]>([]);

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

  const addToLS = () => {
    const lsMounts = localStorage.getItem('dungeoneer_mounts');
    if (!lsMounts) {
      localStorage.setItem('dungeoneer_mounts', JSON.stringify([mount.id]));
    } else {
      const parsedLsMounts: string[] = JSON.parse(lsMounts) as string[];
      parsedLsMounts.push(mount.id);
      localStorage.setItem('dungeoneer_mounts', JSON.stringify(parsedLsMounts));
      mountsInLS.value = parsedLsMounts;
      addMessage(`Added ${mount.name} to your collection.`);
      addMessage(`Log in to make sure you never lose your collection.`);
    }
  };

  const removeFromUserMutation = api.mounts.addToUser.useMutation({
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

  const removeFromLS = () => {
    const lsMounts = localStorage.getItem('dungeoneer_mounts');
    if (lsMounts) {
      const parsedLsMounts = JSON.parse(lsMounts) as string[];
      const updatedMounts = parsedLsMounts.filter((id: string) => id !== mount.id);
      localStorage.setItem('dungeoneer_mounts', JSON.stringify(updatedMounts));
      mountsInLS.value = updatedMounts;
      addMessage(`Removed ${mount.name} from your collection.`);
    }
  };

  return {
    addToUser,
    addToLS,
    removeFromUser,
    removeFromLS,
  };
}
