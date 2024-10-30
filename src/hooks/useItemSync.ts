import { api } from '@/trpc/react';
import { useState, useCallback } from 'react';
import { addMessage } from '@/app/_components/ui/MessagePopup';
import { type Item } from 'types';
import { type Session } from 'next-auth';
import { TRPCClientError } from '@trpc/client';

export default function useItemSync({ session }: { session: Session | null }) {
  const utils = api.useUtils();
  const [isSyncing, setIsSyncing] = useState(false);

  const minionMutation = api.minions.addToUser.useMutation();
  const mountMutation = api.mounts.addToUser.useMutation();
  const cardMutation = api.cards.addToUser.useMutation();
  const orchestrionMutation = api.orchestrions.addToUser.useMutation();
  const spellMutation = api.spells.addToUser.useMutation();
  const hairstyleMutation = api.hairstyles.addToUser.useMutation();
  const emoteMutation = api.emotes.addToUser.useMutation();

  const syncCollection = useCallback(async () => {
    if (!session) {
      addMessage('Please sign in to sync your items.');
      return;
    }

    let localItems: Item[] = [];
    try {
      const storedItems = localStorage.getItem('userItems');
      localItems = storedItems ? (JSON.parse(storedItems) as Item[]) : [];
    } catch (_error) {
      addMessage('Error reading local items. Please try again.');
      return;
    }

    if (localItems.length === 0) {
      addMessage('No local items to sync.');
      return;
    }

    setIsSyncing(true);
    addMessage('Syncing your local items with your account...');

    const syncedItems: string[] = [];

    for (const item of localItems) {
      try {
        let mutation;
        switch (item.type) {
          case 'minions':
            mutation = minionMutation;
            break;
          case 'mounts':
            mutation = mountMutation;
            break;
          case 'cards':
            mutation = cardMutation;
            break;
          case 'orchestrions':
            mutation = orchestrionMutation;
            break;
          case 'spells':
            mutation = spellMutation;
            break;
          case 'hairstyles':
            mutation = hairstyleMutation;
            break;
          case 'emotes':
            mutation = emoteMutation;
            break;
          default:
            throw new Error(`Unknown item type: ${item.type as string}`);
        }

        await mutation.mutateAsync({ id: item.id });
        addMessage(`Added ${item.name} to your account.`);
        syncedItems.push(item.id);
      } catch (error) {
        if (error instanceof TRPCClientError) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (error.data?.code === 'CONFLICT') {
            addMessage(`${item.name} already exists in your collection.`);
            syncedItems.push(item.id);
          } else {
            addMessage(`Failed to sync ${item.name}. Please try adding it manually.`);
          }
        } else {
          addMessage(`Failed to sync ${item.name}. Please try adding it manually.`);
        }
      }
    }

    await utils.invalidate();

    try {
      const remainingItems = localItems.filter((item) => !syncedItems.includes(item.id));
      localStorage.setItem('userItems', JSON.stringify(remainingItems));
    } catch (_error) {
      addMessage('Error updating local items. Some items may need to be synced again.');
    }

    addMessage('Sync process completed.');
    setIsSyncing(false);
  }, [
    session,
    minionMutation,
    mountMutation,
    cardMutation,
    orchestrionMutation,
    spellMutation,
    hairstyleMutation,
    emoteMutation,
    utils,
  ]);

  return { syncCollection, isSyncing };
}
