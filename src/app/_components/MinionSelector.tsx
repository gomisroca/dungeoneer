import { minionsInLS, useMinionLogic } from '@/hooks/useMinionLogic';
import { type Session } from 'next-auth';
import Image from 'next/image';
import { type ExpandedMinion } from 'types';
import Button from './ui/Button';
import { twMerge } from 'tailwind-merge';

function MinionView({ minion, session }: { minion: ExpandedMinion; session: Session | null }) {
  const { addToUser, addToLS, removeFromUser, removeFromLS } = useMinionLogic(minion);
  const isOwnedByUser = session?.user
    ? minion.owners.some((o) => o.id === session.user.id)
    : minionsInLS.value.includes(minion.id);

  return (
    <Button onClick={isOwnedByUser ? (session ? removeFromUser : removeFromLS) : session ? addToUser : addToLS}>
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
      <p className={twMerge('max-w-full flex-shrink overflow-hidden text-ellipsis', isOwnedByUser && 'text-stone-500')}>
        {minion.name}
      </p>
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
