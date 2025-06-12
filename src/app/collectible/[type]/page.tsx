import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { type ItemRouteKey } from 'types';

import Loading from '@/app/collectible/[type]/loading';
import { auth } from '@/server/auth';
import { COLLECTIBLE_TYPES } from '@/utils/consts';

const CollectibleList = dynamic(() => import('@/app/collectible/[type]/list'), { loading: () => <Loading /> });

export default async function CollectibleListWrapper({
  params,
}: {
  params: Promise<{ type: ItemRouteKey }>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const type = (await params).type;
  if (!type || !COLLECTIBLE_TYPES.includes(type)) return notFound();

  const session = await auth();

  return (
    <Suspense fallback={<Loading />}>
      <CollectibleList session={session} routeKey={type} />
    </Suspense>
  );
}
