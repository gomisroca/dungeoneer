'use client';

import { type Session } from 'next-auth';
import { twMerge } from 'tailwind-merge';
import { type ExpandedDungeon, type ExpandedRaid, type ExpandedTrial, type ExpandedVariantDungeon } from 'types';
import useCheckOwnership from '@/hooks/useCheckOwnership';
import ItemSelector from '@/app/_components/ItemSelector';

export default function InstanceListItem({
  instance,
  session,
}: {
  instance: ExpandedDungeon | ExpandedTrial | ExpandedRaid | ExpandedVariantDungeon;
  session: Session | null;
}) {
  const isCompleted = useCheckOwnership(instance, session);

  const [title, ...subtitles] = instance.name.split(/[-:(]/);

  return (
    <div
      className={twMerge(
        'relative flex h-full items-center justify-start font-semibold shadow-md transition duration-200 ease-in hover:shadow-2xl',
        (isCompleted === 'empty' || isCompleted === 'owned') && 'opacity-50 hover:opacity-100'
      )}>
      {(isCompleted === 'owned' || isCompleted === 'empty') && (
        <div className="absolute right-[-15px] top-[-15px] flex contrast-200">
          {isCompleted === 'owned' ? (
            <span className="m-auto text-5xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
              ✔
            </span>
          ) : (
            <span className="m-auto text-5xl text-zinc-500 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)]">✗</span>
          )}
        </div>
      )}
      <div className="flex flex-col items-center justify-start gap-1 p-2">
        {title && (
          <h1 className="line-clamp-2 w-[125px] text-center text-base md:w-[150px] md:text-lg">
            {title[0]!.toUpperCase() + title.slice(1)}
          </h1>
        )}

        {subtitles && (
          <div className="flex w-[125px] flex-col items-center justify-center gap-1 text-sm md:w-[150px]">
            {subtitles.map((sub, i) => (
              <p key={i} className="text-center">
                {sub.split(')')[0]}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 border-l border-zinc-200 px-2 dark:border-zinc-800">
        {instance.minions.length > 0 && (
          <ItemSelector items={instance.minions} type="minions" session={session} compact={true} />
        )}
        {instance.mounts.length > 0 && (
          <ItemSelector items={instance.mounts} type="mounts" session={session} compact={true} />
        )}
        {instance.orchestrions.length > 0 && (
          <ItemSelector items={instance.orchestrions} type="orchestrions" session={session} compact={true} />
        )}
        {instance.spells.length > 0 && (
          <ItemSelector items={instance.spells} type="spells" session={session} compact={true} />
        )}
        {instance.cards.length > 0 && (
          <ItemSelector items={instance.cards} type="cards" session={session} compact={true} />
        )}
        {instance.emotes.length > 0 && (
          <ItemSelector items={instance.emotes} type="emotes" session={session} compact={true} />
        )}
        {instance.hairstyles.length > 0 && (
          <ItemSelector items={instance.hairstyles} type="hairstyles" session={session} compact={true} />
        )}
      </div>
    </div>
  );
}
