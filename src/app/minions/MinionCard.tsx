'use client';

import { api } from '@/trpc/react';
import Image from 'next/image';
import { type Session } from 'next-auth';
import Button from '@/app/_components/ui/Button';
import { type ExpandedMinion } from 'types';
import Source from '../_components/ui/Source';
import { addMessage } from '../_components/ui/MessagePopup';
import { minionsInLS } from './MinionList';

function AddOrRemoveButton({
  minion,
  isOwnedByUser,
  session,
}: {
  minion: ExpandedMinion;
  isOwnedByUser: boolean;
  session: Session | null;
}) {
  const utils = api.useUtils();

  const addToUserMutatiom = api.minions.addToUser.useMutation({
    onSuccess: async () => {
      addMessage(`Added ${minion.name} to your collection.`);
      await utils.minions.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutatiom.mutate({ minionId: minion.id });
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

  const removeFromUserMutatiom = api.minions.removeFromUser.useMutation({
    onSuccess: async () => {
      addMessage(`Removed ${minion.name} from your collection.`);
      await utils.minions.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutatiom.mutate({ minionId: minion.id });
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

  return isOwnedByUser ? (
    <Button
      name="Remove from Collection"
      className="w-full"
      type="submit"
      onClick={session ? removeFromUser : removeFromLS}>
      Remove
    </Button>
  ) : (
    <Button name="Add to Collection" className="w-full" type="submit" onClick={session ? addToUser : addToLS}>
      Add
    </Button>
  );
}

export default function MinionCard({ minion, session }: { minion: ExpandedMinion; session: Session | null }) {
  const isOwnedByUser = session?.user
    ? minion.owners.some((o) => o.id === session.user.id)
    : minionsInLS.value.includes(minion.id);

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-stone-200 bg-stone-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-stone-800 dark:bg-stone-700">
      {minion.image && <Image src={minion.image} alt={minion.name} width={100} height={100} />}
      <h1 className="line-clamp-2 text-center text-xl">{minion.name}</h1>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 md:p-4">
        {minion.sources.map((source) => (
          <Source key={source.id} source={source} />
        ))}
      </div>
      <AddOrRemoveButton minion={minion} isOwnedByUser={isOwnedByUser} session={session} />
    </div>
  );
}
