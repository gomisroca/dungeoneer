'use client';

import {
  type CardSource,
  type EmoteSource,
  type HairstyleSource,
  type MinionSource,
  type MountSource,
  type OrchestrionSource,
  type SpellSource,
} from 'generated/prisma';
import Image from 'next/image';
import { type Session } from 'next-auth';
import { twMerge } from 'tailwind-merge';
import { type ExpandedInstance, type ItemType } from 'types';

import ItemSelectors from '@/app/_components/item-selector';
import Button from '@/app/_components/ui/button';
import Source from '@/app/_components/ui/source';
import { getOwnershipStatus, useIsOwned } from '@/hooks/useCheckOwnership';
import { useItemOwnership } from '@/hooks/useItemOwnership';
import { useState } from 'react';
import { useMessage } from '@/hooks/useMessage';

interface BaseItem {
  id: string;
  name: string;
  image: string | null;
  sources?:
    | CardSource[]
    | MinionSource[]
    | MountSource[]
    | OrchestrionSource[]
    | SpellSource[]
    | EmoteSource[]
    | HairstyleSource[];
  owners: { id: string }[];
}

interface ItemCardProps {
  item: BaseItem;
  type: ItemType;
  session: Session | null;
}

export function InstanceCard({ instance, session }: { instance: ExpandedInstance; session: Session | null }) {
  const isOwned = useIsOwned(instance, session);
  const ownershipStatus = getOwnershipStatus(instance, isOwned);

  const [title, ...subtitles] = instance.name.split(/[-:(]/);

  return (
    <div
      className={twMerge(
        'relative flex h-full min-w-[255px] flex-col items-center justify-start gap-y-4 rounded-xl border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:scale-125 hover:rotate-2 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700',
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
      {instance.image && (
        <Image
          loading="lazy"
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

export function ItemCard({ item, type, session }: ItemCardProps) {
  const { owned, handleAddOrRemove } = useItemOwnership({ ...item, type }, session);
  const [optimisticOwned, setOptimisticOwned] = useState(owned);
 const setMessage = useMessage();

  const handleTransition = async () => {
    setMessage({
      content: optimisticOwned
        ? `Removed ${item.name} from your collection.`
        : `Added ${item.name} to your collection.`,
    });
    setOptimisticOwned((prev) => !prev);
    await handleAddOrRemove();
  };

  return (
    <div
      className={twMerge(
        'relative flex h-full min-w-[255px] flex-col items-center justify-between gap-y-4 rounded-xl border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:scale-125 hover:rotate-2 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700',
        optimisticOwned && 'opacity-50 hover:opacity-100'
      )}>
      {optimisticOwned && (
        <div className="absolute top-[-15px] right-[-15px] flex contrast-200">
          <span className="m-auto text-5xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
            ✔
          </span>
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-y-2">
        {item.image && (
          <Image
            loading="lazy"
            unoptimized
            src={item.image}
            alt={item.name}
            width={100}
            height={100}
            className={twMerge(
              'rounded-xl',
              (type === 'spells' || type === 'emotes') && 'border-2 border-zinc-400 dark:border-zinc-600'
            )}
          />
        )}
        <div className="min-h-[calc(2*1.625rem)]">
          <h1 className="line-clamp-2 text-center text-base leading-relaxed md:text-lg">{item.name}</h1>
        </div>
      </div>
      {item.sources && (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 md:p-4">
          {item.sources.map((source) => (
            <Source key={source.id} source={source} />
          ))}
        </div>
      )}
      <Button arialabel={optimisticOwned ? 'Remove' : 'Add'} className="w-full text-sm md:text-base" onClick={handleTransition}>
        {optimisticOwned ? 'Remove' : 'Add'}
      </Button>
    </div>
  );
}
