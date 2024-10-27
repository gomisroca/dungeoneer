'use client';

import Image from 'next/image';
import { type Session } from 'next-auth';
import { twMerge } from 'tailwind-merge';
import { FaLock } from 'react-icons/fa6';
import { useItemOwnership } from '@/hooks/useItemOwnership';
import { type ItemType } from 'types';
import Button from './ui/Button';
import {
  type HairstyleSource,
  type OrchestrionSource,
  type SpellSource,
  type CardSource,
  type MinionSource,
  type MountSource,
  type EmoteSource,
} from '@prisma/client';
import Source from './ui/Source';

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

export default function ItemCard({ item, type, session }: ItemCardProps) {
  const { owned, handleAddOrRemove } = useItemOwnership({ ...item, type }, session);

  return (
    <div
      className={twMerge(
        'relative flex h-full flex-col items-center justify-start gap-y-4 rounded-xl border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700',
        owned && 'opacity-50 hover:opacity-100'
      )}>
      {owned && (
        <div className="absolute right-[-25px] top-[-25px] flex contrast-200">
          <span className="m-auto text-8xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
            ✔
          </span>
        </div>
      )}
      {item.image && (
        <Image
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
      <h1 className="line-clamp-2 text-center text-lg">{item.name}</h1>
      {item.sources && (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 md:p-4">
          {item.sources.map((source) => (
            <Source key={source.id} source={source} />
          ))}
        </div>
      )}
      <div className="flex w-full flex-col items-start justify-start">
        <Button className="w-full" onClick={handleAddOrRemove} disabled={!session}>
          {owned ? 'Remove' : 'Add'}
        </Button>
        {!session && (
          <div className="mt-2 flex w-full items-center justify-center gap-2">
            <FaLock className="text-neutral-500" />
            <p className="text-sm text-neutral-500">Log in to add to your collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
