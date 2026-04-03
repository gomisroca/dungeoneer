import { type Session } from 'next-auth';
import { useMemo } from 'react';
import { type ExpandedCollectible, type Item } from 'types';

export function useItemFilter({
  items,
  filter,
  session,
}: {
  items: ExpandedCollectible[];
  filter: boolean;
  session: Session | null;
}) {
  return useMemo(() => {
    if (!filter) return items;

    if (session?.user?.id) {
      return items.filter((item) => !item.owners.some((owner) => owner.id === session.user.id));
    }

    try {
      const localItems = JSON.parse(localStorage.getItem('userItems') ?? '[]') as Item[];
      return items.filter((item) => !localItems.some((local) => local.id === item.id));
    } catch {
      return items;
    }
  }, [items, filter, session]);
}
