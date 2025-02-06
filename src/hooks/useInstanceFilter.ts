import { useMemo } from 'react';
import { type Session } from 'next-auth';
import {
  type ExpandedMinion,
  type ExpandedMount,
  type ExpandedCard,
  type ExpandedOrchestrion,
  type ExpandedSpell,
  type ExpandedHairstyle,
  type ExpandedEmote,
  type Item,
  type ExpandedInstance,
} from 'types';

type ExpandedItemType =
  | ExpandedMinion
  | ExpandedMount
  | ExpandedCard
  | ExpandedOrchestrion
  | ExpandedSpell
  | ExpandedHairstyle
  | ExpandedEmote;

function checkOwnership(instance: ExpandedInstance, userId: string | undefined, localItems: string[]) {
  const isOwned = (items: ExpandedItemType[]) =>
    items.every((item) => (userId && item.owners.some((owner) => owner.id === userId)) ?? localItems.includes(item.id));

  return (
    isOwned(instance.minions) &&
    isOwned(instance.mounts) &&
    isOwned(instance.cards) &&
    isOwned(instance.orchestrions) &&
    isOwned(instance.spells) &&
    isOwned(instance.hairstyles) &&
    isOwned(instance.emotes)
  );
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

    const localStorageItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
    const localItems = localStorageItems.map((item) => item.id);

    return instances.reduce<ExpandedInstance[]>((acc, instance) => {
      if (!checkOwnership(instance, session?.user?.id, localItems)) {
        const copyInstance = { ...instance };
        const filterItems = <T extends ExpandedItemType>(items: T[]) =>
          items.filter(
            (item) =>
              !(session?.user?.id && item.owners.some((owner) => owner.id === session.user.id)) &&
              !localItems.includes(item.id)
          );

        copyInstance.minions = filterItems(instance.minions);
        copyInstance.mounts = filterItems(instance.mounts);
        copyInstance.cards = filterItems(instance.cards);
        copyInstance.orchestrions = filterItems(instance.orchestrions);
        copyInstance.spells = filterItems(instance.spells);
        copyInstance.hairstyles = filterItems(instance.hairstyles);
        copyInstance.emotes = filterItems(instance.emotes);

        acc.push(copyInstance);
      }
      return acc;
    }, []);
  }, [instances, filter, session]);
}
