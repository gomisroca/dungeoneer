import { type Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { type ExpandedCollectible, type ExpandedInstance, type Item } from 'types';

const COLLECTIBLE_KEYS = ['minions', 'mounts', 'orchestrions', 'spells', 'cards', 'emotes', 'hairstyles'] as const;

function getLocalItemIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('userItems');
    return stored ? (JSON.parse(stored) as Item[]).map((i) => i.id) : [];
  } catch {
    return [];
  }
}

function checkOwnership(instance: ExpandedInstance, userId: string | undefined): boolean {
  const localIds = userId ? [] : getLocalItemIds();

  return COLLECTIBLE_KEYS.every((key) =>
    (instance[key] as ExpandedCollectible[]).every((item) =>
      userId ? item.owners.some((owner) => owner.id === userId) : localIds.includes(item.id)
    )
  );
}

export function useIsOwned(instance: ExpandedInstance, session: Session | null): boolean {
  const [isOwned, setIsOwned] = useState(false);

  useEffect(() => {
    const update = () => setIsOwned(checkOwnership(instance, session?.user?.id));

    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, [instance, session]);

  return isOwned;
}

export type OwnershipStatus = 'empty' | 'owned' | 'not-owned';

export function getOwnershipStatus(instance: ExpandedInstance, isOwned: boolean): OwnershipStatus {
  const hasAny = COLLECTIBLE_KEYS.some((key) => instance[key].length > 0);
  if (!hasAny) return 'empty';
  return isOwned ? 'owned' : 'not-owned';
}
