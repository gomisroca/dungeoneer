import checkOwnership from '@/utils/checkOwnership';
import { type Session } from 'next-auth';
import { type ExpandedDungeon, type ExpandedRaid, type ExpandedTrial, type ExpandedVariantDungeon } from 'types';

export function useInstanceFilter(
  instances: ExpandedDungeon[] | ExpandedTrial[] | ExpandedRaid[] | ExpandedVariantDungeon[],
  filter: boolean,
  session: Session | null
) {
  let newFilteredInstances: ExpandedDungeon[] | ExpandedTrial[] | ExpandedRaid[] | ExpandedVariantDungeon[] = [];
  switch (filter) {
    case false:
      newFilteredInstances = instances;
      break;
    case true:
      const unfinishedInstances = instances.filter((instance) => !checkOwnership(instance, session));
      for (const instance of unfinishedInstances) {
        const copyInstance = { ...instance };
        copyInstance.minions = instance.minions.filter(
          (item) => !item.owners.some((owner) => owner.id === session?.user?.id)
        );
        copyInstance.mounts = instance.mounts.filter(
          (item) => !item.owners.some((owner) => owner.id === session?.user?.id)
        );
        copyInstance.cards = instance.cards.filter(
          (item) => !item.owners.some((owner) => owner.id === session?.user?.id)
        );
        copyInstance.orchestrions = instance.orchestrions.filter(
          (item) => !item.owners.some((owner) => owner.id === session?.user?.id)
        );
        copyInstance.spells = instance.spells.filter(
          (item) => !item.owners.some((owner) => owner.id === session?.user?.id)
        );
        copyInstance.hairstyles = instance.hairstyles.filter(
          (item) => !item.owners.some((owner) => owner.id === session?.user?.id)
        );
        copyInstance.emotes = instance.emotes.filter(
          (item) => !item.owners.some((owner) => owner.id === session?.user?.id)
        );
        newFilteredInstances.push(copyInstance);
      }
      break;
  }
  return newFilteredInstances;
}
