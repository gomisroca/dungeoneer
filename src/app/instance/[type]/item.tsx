'use client';

import { type Session } from 'next-auth';
import { twMerge } from 'tailwind-merge';
import { type ExpandedInstance } from 'types';

import ItemSelectors from '@/app/_components/item-selector';
import { getOwnershipStatus, useIsOwned } from '@/hooks/useCheckOwnership';

export default function InstanceListItem({
  instance,
  session,
}: {
  instance: ExpandedInstance;
  session: Session | null;
}) {
  const isOwned = useIsOwned(instance, session);
  const ownershipStatus = getOwnershipStatus(instance, isOwned);

  const [title, ...subtitles] = instance.name.split(/[-:(]/);

  return (
    <div
      data-testid="instance-list-item"
      className={twMerge(
        'relative mx-auto flex h-full w-3/4 flex-col items-center justify-start font-semibold shadow-md transition duration-200 ease-in hover:shadow-2xl md:mx-auto md:w-full md:min-w-[300px] md:flex-row lg:min-w-[400px]',
        (ownershipStatus === 'empty' || ownershipStatus === 'owned') && 'opacity-50 hover:opacity-100'
      )}>
      {(ownershipStatus === 'owned' || ownershipStatus === 'empty') && (
        <div className="absolute top-[-15px] right-[-15px] flex contrast-200">
          {ownershipStatus === 'owned' ? (
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
      <div className="flex w-full flex-col justify-center gap-2 p-2 md:flex-wrap md:border-l md:border-zinc-200 dark:border-zinc-800">
        <ItemSelectors instance={instance} session={session} compact={true} />
      </div>
    </div>
  );
}
