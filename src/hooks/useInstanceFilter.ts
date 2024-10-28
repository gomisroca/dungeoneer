import { useMemo } from 'react';
import { type Session } from 'next-auth';
import {
  type ExpandedDungeon,
  type ExpandedRaid,
  type ExpandedTrial,
  type ExpandedVariantDungeon,
  type ExpandedMinion,
  type ExpandedMount,
  type ExpandedCard,
  type ExpandedOrchestrion,
  type ExpandedSpell,
  type ExpandedHairstyle,
  type ExpandedEmote,
  type ItemType,
} from 'types';

type InstanceType = ExpandedDungeon | ExpandedTrial | ExpandedRaid | ExpandedVariantDungeon;
type ExpandedItemType =
  | ExpandedMinion
  | ExpandedMount
  | ExpandedCard
  | ExpandedOrchestrion
  | ExpandedSpell
  | ExpandedHairstyle
  | ExpandedEmote;

interface OwnableItem {
  id: string;
  name: string;
  image: string | null;
  owners: { id: string }[];
  type: ItemType;
}

function checkOwnership(instance: InstanceType, userId: string | undefined, localItems: string[]) {
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

export function useInstanceFilter(instances: InstanceType[], filter: boolean, session: Session | null) {
  return useMemo(() => {
    if (!filter) return instances;

    const localStorageItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as OwnableItem[];
    const localItems = localStorageItems.map((item) => item.id);

    return instances.reduce<InstanceType[]>((acc, instance) => {
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
