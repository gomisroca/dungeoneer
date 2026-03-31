import { useSetAtom } from 'jotai';
import { type Session } from 'next-auth';
import { useCallback, useState } from 'react';
import { type Item } from 'types';

import { addOrRemoveItem } from '@/actions/items';
import { messageAtom } from '@/atoms/message';
import { toErrorMessage } from '@/utils/errors';
import { itemKeytoModel } from '@/utils/mappers';

const getLocalItems = (): Item[] => {
  try {
    const stored = localStorage.getItem('userItems');
    return stored ? (JSON.parse(stored) as Item[]) : [];
  } catch {
    return [];
  }
};

export default function useItemSync({ session }: { session: Session | null }) {
  const setMessage = useSetAtom(messageAtom);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncCollection = useCallback(async () => {
    if (!session) {
      setMessage({ content: 'Please sign in to sync your items.', type: 'error' });
      return;
    }

    const localItems = getLocalItems();

    if (localItems.length === 0) {
      setMessage({ content: 'No local items to sync.', type: 'warning' });
      return;
    }

    setIsSyncing(true);
    setMessage({ content: 'Syncing your local items with your account...' });

    try {
      const results = await Promise.allSettled(
        localItems.map((item) => addOrRemoveItem(itemKeytoModel[item.type], item.id))
      );

      const syncedIds = localItems.filter((_, i) => results[i]?.status === 'fulfilled').map((item) => item.id);

      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        setMessage({
          content: `${failed.length} item(s) failed to sync. Please try adding them manually.`,
          type: 'warning',
        });
      } else {
        setMessage({ content: 'Sync completed successfully.', type: 'success' });
      }

      const remaining = localItems.filter((item) => !syncedIds.includes(item.id));
      localStorage.setItem('userItems', JSON.stringify(remaining));
    } catch (error) {
      setMessage({ content: toErrorMessage(error, 'Sync failed. Please try again.'), type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  }, [session]);

  return { syncCollection, isSyncing, getLocalItems };
}
