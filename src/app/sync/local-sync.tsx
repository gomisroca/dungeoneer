'use client';

import { type Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { MdOutlineSync } from 'react-icons/md';

import Button from '@/app/_components/ui/button';
import useItemSync from '@/hooks/useItemSync';

export default function LocalSync({ session }: { session: Session | null }) {
  const [syncCount, setSyncCount] = useState(0);
  const { syncCollection, isSyncing } = useItemSync({ session });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userItems');
      const items = stored ? (JSON.parse(stored) as unknown) : [];
      setSyncCount(Array.isArray(items) ? items.length : 0);
    } catch {
      setSyncCount(0);
    }
  }, []);

  return (
    <section className="flex flex-col items-center justify-center">
      <p>You have {syncCount} items in your local storage.</p>
      {syncCount > 0 && (
        <Button
          arialabel="Sync Collection"
          onClick={syncCollection}
          disabled={isSyncing || syncCount === 0 || !session}
          className="mx-auto w-64">
          <MdOutlineSync size={20} className={isSyncing ? 'animate-spin' : ''} />
          Sync Local Storage
        </Button>
      )}
    </section>
  );
}
