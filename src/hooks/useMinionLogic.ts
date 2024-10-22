import { api } from '@/trpc/react';
import { type ExpandedMinion } from 'types';
import { addMessage } from '@/app/_components/ui/MessagePopup';
import { minionsInLS } from '@/app/minions/MinionList';

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

  const addToLS = () => {
    const lsMinions = localStorage.getItem('dungeoneer_minions');
    if (!lsMinions) {
      localStorage.setItem('dungeoneer_minions', JSON.stringify([minion.id]));
    } else {
      const parsedLsMinions: string[] = JSON.parse(lsMinions) as string[];
      parsedLsMinions.push(minion.id);
      localStorage.setItem('dungeoneer_minions', JSON.stringify(parsedLsMinions));
      minionsInLS.value = parsedLsMinions;
      addMessage(`Added ${minion.name} to your collection.`);
      addMessage(`Log in to make sure you never lose your collection.`);
    }
  };

  const removeFromUserMutation = api.minions.addToUser.useMutation({
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

  const removeFromLS = () => {
    const lsMinions = localStorage.getItem('dungeoneer_minions');
    if (lsMinions) {
      const parsedLsMinions = JSON.parse(lsMinions) as string[];
      const updatedMinions = parsedLsMinions.filter((id: string) => id !== minion.id);
      localStorage.setItem('dungeoneer_minions', JSON.stringify(updatedMinions));
      minionsInLS.value = updatedMinions;
      addMessage(`Removed ${minion.name} from your collection.`);
    }
  };

  return {
    addToUser,
    addToLS,
    removeFromUser,
    removeFromLS,
  };
}
