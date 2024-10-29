'use client';

import useItemSync from '@/hooks/useItemSync';
import Button from '../ui/Button';
import { type Session } from 'next-auth';
import { MdOutlineSync } from 'react-icons/md';

export default function SyncButton({ session }: { session: Session | null }) {
  const { syncCollection, isSyncing } = useItemSync({ session });

  return (
    <Button onClick={syncCollection} disabled={isSyncing}>
      <MdOutlineSync size={20} className={`${isSyncing ? 'animate-spin' : ''}`} />
    </Button>
  );
}
