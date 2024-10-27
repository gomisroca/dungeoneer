'use client';

import { type Session } from 'next-auth';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { FaLock } from 'react-icons/fa6';
import { useItemOwnership } from '@/hooks/useItemOwnership';
import Button from './ui/Button';
import { type ItemType } from 'types';

interface BaseItem {
  id: string;
  name: string;
  image: string | null;
  owners: { id: string }[];
}

interface ItemViewProps {
  item: BaseItem;
  type: ItemType;
  session: Session | null;
}

function ItemView({ item, type, session }: ItemViewProps) {
  const { owned, handleAddOrRemove } = useItemOwnership({ ...item, type }, session);

  return (
    <Button onClick={handleAddOrRemove} disabled={!session} className="w-5/6 justify-start px-2 py-1 md:w-3/4">
      <div className="relative flex-shrink-0">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            width={50}
            height={50}
            unoptimized
            className={twMerge('flex-shrink-0 rounded-xl', owned && 'opacity-75')}
          />
        )}
        {owned && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
              ✔
            </span>
          </div>
        )}
      </div>
      <div className="flex max-w-full flex-col items-start justify-start overflow-x-hidden">
        <p className={twMerge('max-w-full flex-shrink overflow-x-hidden text-ellipsis', owned && 'text-neutral-500')}>
          {item.name}
        </p>
        {!session && (
          <div className="flex items-center justify-center gap-2 text-wrap text-start">
            <FaLock className="text-neutral-500" />
            <p className="m-auto text-sm text-neutral-500">Log in to add to your collection.</p>
          </div>
        )}
      </div>
    </Button>
  );
}

interface ItemSelectorProps {
  items: BaseItem[];
  type: ItemType;
  session: Session | null;
}

export default function ItemSelector({ items, type, session }: ItemSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {items.map((item) => (
        <ItemView key={item.id} item={item} type={type} session={session} />
      ))}
    </div>
  );
}
