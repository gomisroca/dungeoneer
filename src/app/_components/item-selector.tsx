'use client';

import Image from 'next/image';
import { type Session } from 'next-auth';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { type ExpandedInstance, type ItemType } from 'types';

import Button from '@/app/_components/ui/button';
import { useItemOwnership } from '@/hooks/useItemOwnership';
import { useMessage } from '@/hooks/useMessage';
import { COLLECTIBLE_TYPES } from '@/utils/consts';
import { toErrorMessage } from '@/utils/errors';

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
  const [optimisticOwned, setOptimisticOwned] = useState(owned);
  const setMessage = useMessage();

  const handleTransition = async () => {
    setMessage({
      content: optimisticOwned
        ? `Removed ${item.name} from your collection.`
        : `Added ${item.name} to your collection.`,
    });

    setOptimisticOwned((prev) => !prev);

    try {
      await handleAddOrRemove();
    } catch (error) {
      setOptimisticOwned((prev) => !prev);
      setMessage({
        content: toErrorMessage(error, `Failed to sync ${item.name}.`),
        error: true,
      });
    }
  };
  return (
    <Button
      arialabel="item-view"
      onClick={handleTransition}
      className="w-full items-center justify-between px-2 py-1 md:w-fit">
      <div className="relative flex-shrink-0">
        <div className={twMerge('relative', compact ? 'h-6 w-6' : 'h-12 w-12')}>
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className={twMerge(
                'flex-shrink-0 rounded-md object-contain',
                optimisticOwned && 'opacity-75',
                compact && 'rounded-lg'
              )}
            />
          )}
        </div>
        {optimisticOwned && (
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
            'max-w-full flex-shrink overflow-x-hidden text-sm text-ellipsis md:text-base',
            optimisticOwned && 'text-neutral-500'
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
