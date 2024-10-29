import { type Session } from 'next-auth';
import {
  type Item,
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
      if (session) {
        return items.filter((item) => !item.owners.some((owner) => owner.id === session?.user?.id));
      } else {
        const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
        return items.filter((item) => !localItems.some((localItem: Item) => localItem.id === item.id));
      }
  }
}
