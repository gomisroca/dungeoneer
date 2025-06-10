'use client';

import { type Session } from 'next-auth';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { type ExpandedInstance } from 'types';
import useCheckOwnership from '@/hooks/useCheckOwnership';
import ItemSelectors from './ItemSelector';

export default function InstanceCard({ instance, session }: { instance: ExpandedInstance; session: Session | null }) {
  const isCompleted = useCheckOwnership(instance, session);

  const [title, ...subtitles] = instance.name.split(/[-:(]/);

  return (
    <div
      className={twMerge(
        'relative flex h-full min-w-[255px] flex-col items-center justify-start gap-y-4 rounded-xl border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:scale-125 hover:rotate-2 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700',
        (isCompleted === 'empty' || isCompleted === 'owned') && 'opacity-50 hover:opacity-100'
      )}>
      {(isCompleted === 'owned' || isCompleted === 'empty') && (
        <div className="absolute top-[-15px] right-[-15px] flex contrast-200">
          {isCompleted === 'owned' ? (
            <span className="m-auto text-5xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
              ✔
            </span>
          ) : (
            <span className="m-auto text-5xl text-zinc-500 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)]">✗</span>
          )}
        </div>
      )}
      {instance.image && (
        <Image
          src={instance.image}
          alt={instance.name}
          width={300}
          height={100}
          className="w-full object-cover"
          unoptimized
        />
      )}
      <div className="flex flex-col items-center justify-center gap-1">
        {title && (
          <h1 className="line-clamp-2 text-center text-base md:text-lg">{title[0]!.toUpperCase() + title.slice(1)}</h1>
        )}

        {subtitles && (
          <div className="flex flex-row items-center justify-center gap-1 text-sm">
            {subtitles.map((sub, i) => (
              <p key={i} className="text-center">
                {sub.split(')')[0]}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <ItemSelectors instance={instance} session={session} />
      </div>
    </div>
  );
}
