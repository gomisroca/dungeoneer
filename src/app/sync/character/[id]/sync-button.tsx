'use client';

import { type Session } from 'next-auth';

import { syncLodestone } from '@/actions/lodestone';
import Button from '@/app/_components/ui/button';
import { useMessage } from '@/hooks/useMessage';
import { toErrorMessage } from '@/utils/errors';

function SyncButton({ session, lodestoneId }: { session: Session | null; lodestoneId: string }) {
  const setMessage = useMessage();

  const handleSync = async () => {
    try {
      // Get confirmation from the user
      const confirmed = confirm(
        'Are you sure you want to sync your character?\nThis will update your minion and mount collections to match those of the character on Lodestone.\nYour current collection will be replaced.'
      );
      if (!confirmed) return;

      // Optimistically set the 'in progress' message
      setMessage({ content: 'Syncing character...' });

      // Call the server action
      await syncLodestone({ lodestoneId });

      // Once the server action is completed, set the 'success' message
      setMessage({ content: 'Character synced successfully.' });
    } catch (error) {
      // If there was an error during the action, set the error message
      setMessage({ content: toErrorMessage(error, 'Syncing character failed.'), error: true });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <Button className="mx-auto w-64" disabled={!session} onClick={handleSync}>
        Sync Character
      </Button>
      {!session && <p className="text-sm">You must be logged in to sync your character.</p>}
    </section>
  );
}

export default SyncButton;
