import { api } from '@/trpc/react';
import { addMessage } from '@/app/_components/ui/MessagePopup';
import { type ExpandedEmote } from 'types';

export function useEmoteLogic(emote: ExpandedEmote) {
  const utils = api.useUtils();

  const addToUserMutation = api.emotes.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${emote.name} to your collection.`);
      await utils.emotes.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutation.mutate({ emoteId: emote.id });
  };

  const removeFromUserMutation = api.emotes.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${emote.name} from your collection.`);
      await utils.emotes.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutation.mutate({ emoteId: emote.id });
  };

  return {
    addToUser,
    removeFromUser,
  };
}
