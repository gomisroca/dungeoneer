import { auth } from '@/server/auth';
import { Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { COLLECTIBLE_TYPES } from '@/utils/consts';
import { ItemRouteKey } from 'types';

const CollectibleList = dynamic(() => import('./CollectibleList'), { loading: () => <Loading /> });

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
