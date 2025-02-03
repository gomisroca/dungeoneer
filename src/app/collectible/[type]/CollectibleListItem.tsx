'use client';

import { type Session } from 'next-auth';
import { twMerge } from 'tailwind-merge';
import { type ItemType } from 'types';
import { useItemOwnership } from '@/hooks/useItemOwnership';
import Button from '@/app/_components/ui/Button';
import Source from '@/app/_components/ui/Source';
import Image from 'next/image';
import {
  type HairstyleSource,
  type OrchestrionSource,
  type SpellSource,
  type CardSource,
  type MinionSource,
  type MountSource,
  type EmoteSource,
} from '@prisma/client';

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

export default function CollectibleListItem({ item, type, session }: ItemCardProps) {
  const { owned, handleAddOrRemove } = useItemOwnership({ ...item, type }, session);

  return (
    <div
      className={twMerge(
        'relative flex h-full items-center justify-between border-l border-zinc-200 p-4 font-semibold shadow-md transition duration-200 ease-in hover:shadow-2xl dark:border-zinc-800',
        owned && 'opacity-50 hover:opacity-100'
      )}>
      {owned && (
        <div className="absolute right-[-15px] top-[-15px] flex contrast-200">
          <span className="m-auto text-5xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
            ✔
          </span>
        </div>
      )}
      <div className="flex w-[125px] flex-col items-center justify-center gap-y-2">
        {item.image && (
          <Image
            unoptimized
            src={item.image}
            alt={item.name}
            width={50}
            height={50}
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
        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 md:p-2">
          {item.sources.map((source) => (
            <Source key={source.id} source={source} compact={true} />
          ))}
        </div>
      )}
      <Button arialabel={owned ? 'Remove' : 'Add'} className="text-sm md:text-base" onClick={handleAddOrRemove}>
        {owned ? 'Remove' : 'Add'}
      </Button>
    </div>
  );
}
