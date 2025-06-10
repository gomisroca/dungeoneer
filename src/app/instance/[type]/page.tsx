import { auth } from '@/server/auth';
import { Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';
import { INSTANCE_TYPES } from '@/utils/consts';
import { notFound } from 'next/navigation';
import { InstanceRouteKey } from 'types';

const InstanceList = dynamic(() => import('./InstanceList'));

export default async function InstanceListWrapper({ params }: { params: Promise<{ type: InstanceRouteKey }> }) {
  const type = (await params).type;
  if (!type || !INSTANCE_TYPES.includes(type)) return notFound();

  const session = await auth();

  return (
    <Suspense fallback={<Loading />}>
      <InstanceList session={session} routeKey={type} />
    </Suspense>
  );
}
