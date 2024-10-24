import { api } from '@/trpc/react';
import { type ExpandedHairstyle } from 'types';
import { addMessage } from '@/app/_components/ui/MessagePopup';

export function useHairstyleLogic(hairstyle: ExpandedHairstyle) {
  const utils = api.useUtils();

  const addToUserMutation = api.hairstyles.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${hairstyle.name} to your collection.`);
      await utils.hairstyles.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutation.mutate({ hairstyleId: hairstyle.id });
  };

  const removeFromUserMutation = api.hairstyles.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${hairstyle.name} from your collection.`);
      await utils.hairstyles.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutation.mutate({ hairstyleId: hairstyle.id });
  };

  return {
    addToUser,
    removeFromUser,
  };
}
