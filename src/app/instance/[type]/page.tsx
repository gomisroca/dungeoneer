import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import { Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';
import { INSTANCE_TYPES } from '@/utils/consts';
import { notFound } from 'next/navigation';

const InstanceList = dynamic(() => import('./InstanceList'));

export default async function InstanceListWrapper({ params }: { params: Promise<{ type: string }> }) {
  const type = (await params).type;
  if (!type || !INSTANCE_TYPES.includes(type)) return notFound();

  const routeKey = type as 'dungeons' | 'raids' | 'trials' | 'variants';
  const initialInstances = await api[routeKey].getAll({ limit: 18 });
  const session = await getServerAuthSession();
  return (
    <Suspense fallback={<Loading />}>
      <InstanceList session={session} initialInstances={initialInstances} routeKey={routeKey} />
    </Suspense>
  );
}
