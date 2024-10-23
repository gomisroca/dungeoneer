import { type Session } from 'next-auth';
import Image from 'next/image';
import { type ExpandedMount } from 'types';
import Button from './ui/Button';
import { twMerge } from 'tailwind-merge';
import { mountsInLS, useMountLogic } from '@/hooks/useMountLogic';

function MountView({ mount, session }: { mount: ExpandedMount; session: Session | null }) {
  const { addToUser, addToLS, removeFromUser, removeFromLS } = useMountLogic(mount);
  const isOwnedByUser = session?.user
    ? mount.owners.some((o) => o.id === session.user.id)
    : mountsInLS.value.includes(mount.id);

  return (
    <Button onClick={isOwnedByUser ? (session ? removeFromUser : removeFromLS) : session ? addToUser : addToLS}>
      <div className="relative flex-shrink-0">
        {mount.image && (
          <Image
            src={mount.image}
            alt={mount.name}
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
        {mount.name}
      </p>
    </Button>
  );
}

function MountSelector({ mounts, session }: { mounts: ExpandedMount[]; session: Session | null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {mounts.map((mount) => (
        <MountView key={mount.id} mount={mount} session={session} />
      ))}
    </div>
  );
}

export default MountSelector;
