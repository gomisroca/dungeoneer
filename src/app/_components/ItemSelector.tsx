'use client';

import { type Session } from 'next-auth';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { useItemOwnership } from '@/hooks/useItemOwnership';
import Button from './ui/Button';
import { type ExpandedInstance, type ItemType } from 'types';
import { COLLECTIBLE_TYPES } from '@/utils/consts';

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
  compact?: boolean;
}

function ItemView({ item, type, session, compact = false }: ItemViewProps) {
  const { owned, handleAddOrRemove } = useItemOwnership({ ...item, type }, session);

  return (
    <Button
      arialabel="item-view"
      onClick={handleAddOrRemove}
      className={twMerge('w-5/6 justify-start px-2 py-1 md:w-3/4', compact && 'w-[200px] md:w-fit')}>
      <div className="relative flex-shrink-0">
        <div className={twMerge('relative', compact ? 'h-6 w-6' : 'h-12 w-12')}>
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={twMerge(
                'flex-shrink-0 rounded-xl object-contain',
                owned && 'opacity-75',
                compact && 'rounded-lg'
              )}
            />
          )}
        </div>
        {owned && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl text-cyan-300 [text-shadow:_2px_2px_2px_rgb(0_0_0_/_40%)] dark:text-cyan-700">
              ✔
            </span>
          </div>
        )}
      </div>
      <div className="flex max-w-full flex-col items-start justify-start overflow-x-hidden">
        <p
          className={twMerge(
            'max-w-full flex-shrink overflow-x-hidden text-ellipsis text-sm md:text-base',
            owned && 'text-neutral-500'
          )}>
          {item.name}
        </p>
      </div>
    </Button>
  );
}

interface ItemSelectorProps {
  items: BaseItem[];
  type: ItemType;
  session: Session | null;
  compact?: boolean;
}

export function ItemSelector({ items, type, session, compact = false }: ItemSelectorProps) {
  return (
    <>
      {items.map((item) => (
        <ItemView key={item.id} item={item} type={type} session={session} compact={compact} />
      ))}
    </>
  );
}

interface ItemSelectorsProps {
  instance: ExpandedInstance;
  session: Session | null;
  compact?: boolean;
}

export default function ItemSelectors({ instance, session, compact = false }: ItemSelectorsProps) {
  return (
    <>
      {COLLECTIBLE_TYPES.map((type) => (
        <ItemSelector
          key={type}
          items={instance[type as ItemType]}
          type={type as ItemType}
          session={session}
          compact={compact}
        />
      ))}
    </>
  );
}
