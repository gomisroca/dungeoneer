'use client';

import { useHairstyleLogic } from '@/hooks/useHairstyleLogic';
import { type Session } from 'next-auth';
import Image from 'next/image';
import { type ExpandedHairstyle } from 'types';
import Button from '../ui/Button';
import { twMerge } from 'tailwind-merge';
import { FaLock } from 'react-icons/fa6';

function HairstyleView({ hairstyle, session }: { hairstyle: ExpandedHairstyle; session: Session | null }) {
  const { addToUser, removeFromUser } = useHairstyleLogic(hairstyle);
  const isOwnedByUser = session?.user.hairstyles.some((m) => m.id === hairstyle.id);

  return (
    <Button
      onClick={isOwnedByUser ? removeFromUser : addToUser}
      disabled={!session}
      className="w-5/6 justify-start px-2 py-1 md:w-3/4">
      <div className="relative flex-shrink-0">
        {hairstyle.image && (
          <Image
            src={hairstyle.image}
            alt={hairstyle.name}
            width={50}
            height={50}
            unoptimized
            className={twMerge('flex-shrink-0 rounded-xl', isOwnedByUser && 'opacity-75')} // Prevents the image from shrinking
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
      <div className="flex max-w-full flex-col items-start justify-start overflow-x-hidden">
        <p
          className={twMerge(
            'max-w-full flex-shrink overflow-x-hidden text-ellipsis',
            isOwnedByUser && 'text-stone-500'
          )}>
          {hairstyle.name}
        </p>
        {!session && (
          <div className="flex items-center justify-center gap-2 text-wrap text-start">
            <FaLock className="text-stone-400 dark:text-stone-600" />
            <p className="m-auto text-sm text-stone-400 dark:text-stone-600">Log in to add to your collection.</p>
          </div>
        )}
      </div>
    </Button>
  );
}

function HairstyleSelector({ hairstyles, session }: { hairstyles: ExpandedHairstyle[]; session: Session | null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {hairstyles.map((hairstyle) => (
        <HairstyleView key={hairstyle.id} hairstyle={hairstyle} session={session} />
      ))}
    </div>
  );
}

export default HairstyleSelector;
