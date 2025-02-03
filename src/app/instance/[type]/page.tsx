import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import { Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';

const InstanceList = dynamic(() => import('./InstanceList'));

export default async function DungeonListWrapper({ params }: { params: Promise<{ type: string }> }) {
  const type = (await params).type;
  if (!type || !['dungeons', 'raids', 'trials', 'variants'].includes(type)) return null;

  const routeKey = type as 'dungeons' | 'raids' | 'trials' | 'variants';
  const initialInstances = await api[routeKey].getAll({ limit: 9 });
  const session = await getServerAuthSession();
  return (
    <Suspense fallback={<Loading />}>
      <InstanceList session={session} initialInstances={initialInstances} routeKey={routeKey} />
    </Suspense>
  );
}
