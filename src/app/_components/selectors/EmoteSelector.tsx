'use client';

import { type Session } from 'next-auth';
import Image from 'next/image';
import { type ExpandedEmote } from 'types';
import Button from '../ui/Button';
import { twMerge } from 'tailwind-merge';
import { FaLock } from 'react-icons/fa6';
import { useEmoteLogic } from '@/hooks/useEmoteLogic';

function EmoteView({ emote, session }: { emote: ExpandedEmote; session: Session | null }) {
  const { addToUser, removeFromUser } = useEmoteLogic(emote);
  const isOwnedByUser = session?.user.emotes.some((m) => m.id === emote.id);

  return (
    <Button
      onClick={isOwnedByUser ? removeFromUser : addToUser}
      disabled={!session}
      className="w-5/6 justify-start px-2 py-1 md:w-3/4">
      <div className="relative flex-shrink-0">
        {emote.image && (
          <Image
            src={emote.image}
            alt={emote.name}
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
          {emote.name}
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

function EmoteSelector({ emotes, session }: { emotes: ExpandedEmote[]; session: Session | null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {emotes.map((emote) => (
        <EmoteView key={emote.id} emote={emote} session={session} />
      ))}
    </div>
  );
}

export default EmoteSelector;
