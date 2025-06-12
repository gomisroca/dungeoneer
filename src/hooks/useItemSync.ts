import { type Session } from 'next-auth';
import { useCallback, useState } from 'react';
import { type Item } from 'types';

import { addOrRemoveItem } from '@/actions/items';
import { useMessage } from '@/hooks/useMessage';
import { toErrorMessage } from '@/utils/errors';
import { itemKeytoModel } from '@/utils/mappers';

export default function useItemSync({ session }: { session: Session | null }) {
  const setMessage = useMessage();
  const [isSyncing, setIsSyncing] = useState(false);

  const getLocalItems = () => {
    try {
      const storedItems = localStorage.getItem('userItems');
      return storedItems ? (JSON.parse(storedItems) as Item[]) : [];
    } catch (error) {
      return [];
    }
  };

  const syncCollection = useCallback(async () => {
    if (!session) {
      setMessage({ content: 'Please sign in to sync your items.', error: true });
      return;
    }

    let localItems: Item[] = [];
    try {
      const storedItems = localStorage.getItem('userItems');
      localItems = storedItems ? (JSON.parse(storedItems) as Item[]) : [];
    } catch (error) {
      setMessage({
        content: toErrorMessage(error, 'Error reading local items. Please try again.'),
        error: true,
      });
      return;
    }

    if (localItems.length === 0) {
      setMessage({ content: 'No local items to sync.', error: true });
      return;
    }

    setIsSyncing(true);
    setMessage({ content: 'Syncing your local items with your account...' });

    const syncedItems: string[] = [];

    for (const item of localItems) {
      try {
        await addOrRemoveItem(itemKeytoModel[item.type], { id: item.id });
        syncedItems.push(item.id);
      } catch (error) {
        setMessage({
          content: toErrorMessage(error, `Failed to sync ${item.name}. Please try adding it manually.`),
          error: true,
        });
      }
    }

    try {
      const remainingItems = localItems.filter((item) => !syncedItems.includes(item.id));
      localStorage.setItem('userItems', JSON.stringify(remainingItems));
    } catch (error) {
      setMessage({
        content: toErrorMessage(error, 'Error updating local items. Some items may need to be synced again.'),
        error: true,
      });
    }

    setMessage({ content: 'Sync process completed.' });
    setIsSyncing(false);
  }, [session, addOrRemoveItem]);

  return { syncCollection, isSyncing, getLocalItems };
}
