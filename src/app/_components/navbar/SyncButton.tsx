'use client';

import useItemSync from '@/hooks/useItemSync';
import Button from '../ui/Button';
import { type Session } from 'next-auth';
import { MdOutlineSync } from 'react-icons/md';
import { useEffect, useState } from 'react';

export default function SyncButton({ session }: { session: Session | null }) {
  const [syncCount, setSyncCount] = useState(0);
  const { syncCollection, isSyncing, getLocalItems } = useItemSync({ session });

  useEffect(() => {
    const localItems = getLocalItems();
    if (localItems.length > 0) {
      setSyncCount(localItems.length);
    }
  }, [getLocalItems, syncCollection]);

  return (
    <Button
      onClick={syncCollection}
      disabled={isSyncing || syncCount === 0}
      className={`${syncCount === 0 && 'hidden'}`}>
      <MdOutlineSync size={20} className={`${isSyncing && 'animate-spin'}`} />
    </Button>
  );
}
