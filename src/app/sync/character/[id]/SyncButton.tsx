'use client';

import Button from '@/app/_components/ui/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/_components/ui/Dialog';
import { addMessage } from '@/app/_components/ui/MessagePopup';
import { api } from '@/trpc/react';
import { type Session } from 'next-auth';

function SyncButton({ session, lodestoneId }: { session: Session | null; lodestoneId: string }) {
  const syncLodestone = api.lodestone.sync.useMutation({
    onSuccess: async () => {
      addMessage(`Synced your character.`);
    },
    onError: (error) => {
      addMessage(error.message);
    },
  });

  const handleSync = async () => {
    if (!session?.user.id) return;
    await syncLodestone.mutateAsync({ lodestoneId });
  };

  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="mx-auto w-64" disabled={!session || syncLodestone.isPending}>
            Sync Character
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <p>This will update your minion and mount collections to match those of the character on Lodestone.</p>
              <p>Your current collection will be replaced.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSync()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {!session && <p className="text-sm">You must be logged in to sync your character.</p>}
    </section>
  );
}

export default SyncButton;
