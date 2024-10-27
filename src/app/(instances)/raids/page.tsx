import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const RaidList = dynamic(() => import('./RaidList'));

export default async function RaidListWrapper() {
  const initialRaids = await api.raids.getAll({ limit: 30 });
  const session = await getServerAuthSession();
  return (
    <Suspense fallback={<Loading />}>
      <RaidList session={session} initialRaids={initialRaids} />
    </Suspense>
  );
}
