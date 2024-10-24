'use client';

import { useMinionLogic } from '@/hooks/useMinionLogic';
import { type Session } from 'next-auth';
import Image from 'next/image';
import { type ExpandedMinion } from 'types';
import Button from './ui/Button';
import { twMerge } from 'tailwind-merge';
import { FaLock } from 'react-icons/fa6';

function MinionView({ minion, session }: { minion: ExpandedMinion; session: Session | null }) {
  const { addToUser, removeFromUser } = useMinionLogic(minion);
  const isOwnedByUser = session?.user.minions.some((m) => m.id === minion.id);

  return (
    <Button onClick={isOwnedByUser ? removeFromUser : addToUser} disabled={!session} className="p-0">
      <div className="relative flex-shrink-0">
        {minion.image && (
          <Image
            src={minion.image}
            alt={minion.name}
            width={50}
            height={50}
            className={twMerge('flex-shrink-0', isOwnedByUser && 'opacity-75')} // Prevents the image from shrinking
          />
        )}
        {isOwnedByUser && (
          <div className="absolute bottom-0 left-0 right-0 top-0 flex">
            <span className="m-auto text-4xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
              ✔
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-start">
        <p
          className={twMerge(
            'max-w-full flex-shrink overflow-hidden text-ellipsis',
            isOwnedByUser && 'text-stone-500'
          )}>
          {minion.name}
        </p>
        {!session && (
          <div className="flex items-center justify-center gap-2">
            <FaLock className="text-stone-400 dark:text-stone-600" />
            <p className="m-auto text-sm text-stone-400 dark:text-stone-600">Log in to add to your collection.</p>
          </div>
        )}
      </div>
    </Button>
  );
}

function MinionSelector({ minions, session }: { minions: ExpandedMinion[]; session: Session | null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {minions.map((minion) => (
        <MinionView key={minion.id} minion={minion} session={session} />
      ))}
    </div>
  );
}

export default MinionSelector;
