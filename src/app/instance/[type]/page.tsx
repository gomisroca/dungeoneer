import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { type InstanceRouteKey } from 'types';

import Loading from '@/app/instance/[type]/loading';
import { auth } from '@/server/auth';
import { INSTANCE_TYPES } from '@/utils/consts';

const InstanceList = dynamic(() => import('@/app/instance/[type]/list'));

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
