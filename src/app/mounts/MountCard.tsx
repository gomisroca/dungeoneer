'use client';

import Image from 'next/image';
import { type Session } from 'next-auth';
import Button from '@/app/_components/ui/Button';
import { type ExpandedMount } from 'types';
import Source from '../_components/ui/Source';
import { mountsInLS, useMountLogic } from '@/hooks/useMountLogic';
import { twMerge } from 'tailwind-merge';

function AddOrRemoveButton({
  mount,
  isOwnedByUser,
  session,
}: {
  mount: ExpandedMount;
  isOwnedByUser: boolean;
  session: Session | null;
}) {
  const { addToUser, addToLS, removeFromUser, removeFromLS } = useMountLogic(mount);

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

export default function Mountard({ mount, session }: { mount: ExpandedMount; session: Session | null }) {
  const isOwnedByUser = session?.user
    ? mount.owners.some((o) => o.id === session.user.id)
    : mountsInLS.value.includes(mount.id);

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
      {mount.image && <Image src={mount.image} alt={mount.name} width={100} height={100} />}
      <h1 className="line-clamp-2 text-center text-xl">{mount.name}</h1>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 md:p-4">
        {mount.sources.map((source) => (
          <Source key={mount.id} source={source} />
        ))}
      </div>
      <AddOrRemoveButton mount={mount} isOwnedByUser={isOwnedByUser} session={session} />
    </div>
  );
}
