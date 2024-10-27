import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const MinionList = dynamic(() => import('./MinionList'));

export default async function MinionListWrapper() {
  const initialMinions = await api.minions.getAll({ limit: 15 });
  const session = await getServerAuthSession();

  return (
    <Suspense fallback={<Loading />}>
      <MinionList session={session} initialMinions={initialMinions} />
    </Suspense>
  );
}
