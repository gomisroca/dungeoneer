'use client';

import { type Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { MdOutlineSync } from 'react-icons/md';

import Button from '@/app/_components/ui/button';
import useItemSync from '@/hooks/useItemSync';

interface LocalSyncButtonProps {
  isSyncing: boolean;
  syncCollection: () => void;
  syncCount: number;
  session: Session | null;
}

function LocalSyncButton({ isSyncing, syncCollection, syncCount, session }: LocalSyncButtonProps) {
  return (
    <Button
      arialabel="Sync Collection"
      name="Sync Collection"
      onClick={syncCollection}
      disabled={isSyncing || syncCount === 0 || !session}
      className={`${syncCount === 0 ? 'hidden' : 'mx-auto w-64'} `}>
      <MdOutlineSync size={20} className={`${isSyncing && 'animate-spin'}`} />
      Sync Local Storage
    </Button>
  );
}

export default function LocalSync({ session }: { session: Session | null }) {
  const [syncCount, setSyncCount] = useState(0);
  const { syncCollection, isSyncing, getLocalItems } = useItemSync({ session });

  useEffect(() => {
    const localItems = getLocalItems();
    if (localItems.length > 0) {
      setSyncCount(localItems.length);
    }
  }, [getLocalItems]);

  return (
    <section className="flex flex-col items-center justify-center">
      <p>You have {syncCount} items in your local storage.</p>
      <LocalSyncButton isSyncing={isSyncing} syncCollection={syncCollection} syncCount={syncCount} session={session} />
    </section>
  );
}
