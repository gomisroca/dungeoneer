import { type Session } from 'next-auth';
import { useMemo } from 'react';
import { type ExpandedCollectible, type ExpandedInstance, type Item } from 'types';

function getLocalItemIds(): string[] {
  try {
    const stored = localStorage.getItem('userItems');
    return stored ? (JSON.parse(stored) as Item[]).map((i) => i.id) : [];
  } catch {
    return [];
  }
}

function isItemOwned(item: ExpandedCollectible, userId: string | undefined, localIds: string[]): boolean {
  if (userId) return item.owners.some((owner) => owner.id === userId);
  return localIds.includes(item.id);
}

function filterCollectibles<T extends ExpandedCollectible>(
  items: T[],
  userId: string | undefined,
  localIds: string[]
): T[] {
  return items.filter((item) => !isItemOwned(item, userId, localIds));
}

export function useInstanceFilter({
  instances,
  filter,
  session,
}: {
  instances: ExpandedInstance[];
  filter: boolean;
  session: Session | null;
}) {
  return useMemo(() => {
    if (!filter) return instances;

    const userId = session?.user?.id;
    const localIds = typeof window !== 'undefined' ? getLocalItemIds() : [];

    return instances
      .map((instance) => ({
        ...instance,
        minions: filterCollectibles(instance.minions, userId, localIds),
        mounts: filterCollectibles(instance.mounts, userId, localIds),
        cards: filterCollectibles(instance.cards, userId, localIds),
        orchestrions: filterCollectibles(instance.orchestrions, userId, localIds),
        spells: filterCollectibles(instance.spells, userId, localIds),
        hairstyles: filterCollectibles(instance.hairstyles, userId, localIds),
        emotes: filterCollectibles(instance.emotes, userId, localIds),
      }))
      .filter(
        (instance) =>
          instance.minions.length > 0 ||
          instance.mounts.length > 0 ||
          instance.cards.length > 0 ||
          instance.orchestrions.length > 0 ||
          instance.spells.length > 0 ||
          instance.hairstyles.length > 0 ||
          instance.emotes.length > 0
      );
  }, [instances, filter, session]);
}
