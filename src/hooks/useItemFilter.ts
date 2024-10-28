import { type Session } from 'next-auth';
import {
  type ExpandedCard,
  type ExpandedEmote,
  type ExpandedHairstyle,
  type ExpandedMinion,
  type ExpandedMount,
  type ExpandedOrchestrion,
  type ExpandedSpell,
} from 'types';

export function useItemFilter(
  items:
    | ExpandedCard[]
    | ExpandedMinion[]
    | ExpandedMount[]
    | ExpandedOrchestrion[]
    | ExpandedSpell[]
    | ExpandedHairstyle[]
    | ExpandedEmote[],
  filter: boolean,
  session: Session | null
) {
  switch (filter) {
    case false:
      return items;
    case true:
      return items.filter((item) => !item.owners.some((owner) => owner.id === session?.user?.id));
  }
}
