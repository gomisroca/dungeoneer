'use client';

import Image from 'next/image';
import { type Session } from 'next-auth';
import Button from '@/app/_components/ui/Button';
import { type ExpandedMinion } from 'types';
import Source from '../_components/ui/Source';
import { useMinionLogic } from '@/hooks/useMinionLogic';
import { twMerge } from 'tailwind-merge';

function AddOrRemoveButton({
  minion,
  isOwnedByUser,
  session,
}: {
  minion: ExpandedMinion;
  isOwnedByUser: boolean;
  session: Session | null;
}) {
  const { addToUser, removeFromUser } = useMinionLogic(minion);

  return isOwnedByUser ? (
    <Button name="Remove from Collection" className="w-full" type="submit" onClick={removeFromUser} disabled={!session}>
      Remove
    </Button>
  ) : (
    <Button name="Add to Collection" className="w-full" type="submit" onClick={addToUser} disabled={!session}>
      Add
    </Button>
  );
}

export default function MinionCard({ minion, session }: { minion: ExpandedMinion; session: Session | null }) {
  const isOwnedByUser = minion.owners.some((o) => o.id === session?.user.id);

  return (
    <div
      className={twMerge(
        'relative flex flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-stone-200 bg-stone-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-stone-800 dark:bg-stone-700',
        isOwnedByUser && 'opacity-50 hover:opacity-100'
      )}>
      {isOwnedByUser && (
        <div className="absolute right-[-25px] top-[-25px] flex contrast-200">
          <span className="m-auto text-8xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
            ✔
          </span>
        </div>
      )}
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
