import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import { Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';

const DungeonList = dynamic(() => import('./DungeonList'));

export default async function DungeonListWrapper() {
  const initialDungeons = await api.dungeons.getAll({ limit: 9 });
  const session = await getServerAuthSession();
  return (
    <Suspense fallback={<Loading />}>
      <DungeonList session={session} initialDungeons={initialDungeons} />
    </Suspense>
  );
}
