import { auth } from '@/server/auth';
import { Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { COLLECTIBLE_TYPES, EXPANSIONS } from '@/utils/consts';
import { fetchItems } from '@/server/queries/items';
import { ItemRouteKey } from 'types';
import { itemKeytoModel } from '@/utils/mappers';

const CollectibleList = dynamic(() => import('./CollectibleList'));

export default async function CollectibleListWrapper({
  params,
  searchParams,
}: {
  params: Promise<{ type: ItemRouteKey }>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const type = (await params).type;
  if (!type || !COLLECTIBLE_TYPES.includes(type)) return notFound();

  const expansion = searchParams?.ex ?? undefined;

  const initialCollectibles = await fetchItems(itemKeytoModel[type], {
    limit: 30,
    expansion: EXPANSIONS[expansion as keyof typeof EXPANSIONS],
  });
  if (!initialCollectibles) notFound();

  const session = await auth();

  return (
    <Suspense fallback={<Loading />}>
      <CollectibleList session={session} initialCollectibles={initialCollectibles} routeKey={type} />
    </Suspense>
  );
}
