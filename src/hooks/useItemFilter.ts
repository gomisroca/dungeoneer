import { type Session } from 'next-auth';
import {
  type ItemType,
  type ExpandedCard,
  type ExpandedEmote,
  type ExpandedHairstyle,
  type ExpandedMinion,
  type ExpandedMount,
  type ExpandedOrchestrion,
  type ExpandedSpell,
} from 'types';

interface OwnableItem {
  id: string;
  name: string;
  image: string | null;
  owners: { id: string }[];
  type: ItemType;
}

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
        const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as OwnableItem[];
        return items.filter((item) => !localItems.some((localItem: OwnableItem) => localItem.id === item.id));
      }
  }
}
