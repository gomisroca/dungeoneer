import { auth } from '@/server/auth';
import { api } from '@/trpc/server';
import { Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';
import { EXPANSIONS, INSTANCE_TYPES } from '@/utils/consts';
import { notFound } from 'next/navigation';

const InstanceList = dynamic(() => import('./InstanceList'));

export default async function InstanceListWrapper({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const type = (await params).type;
  if (!type || !INSTANCE_TYPES.includes(type)) return notFound();
  const routeKey = type as 'dungeons' | 'raids' | 'trials' | 'variants';

  const expansion = searchParams?.ex ?? undefined;

  const initialInstances = await api[routeKey].getAll({
    limit: 20,
    expansion: EXPANSIONS[expansion as keyof typeof EXPANSIONS],
  });
  const session = await auth();
  return (
    <Suspense fallback={<Loading />}>
      <InstanceList session={session} initialInstances={initialInstances} routeKey={routeKey} />
    </Suspense>
  );
}
