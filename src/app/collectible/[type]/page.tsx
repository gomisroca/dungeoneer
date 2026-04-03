import { notFound } from 'next/navigation';
import { type ItemRouteKey } from 'types';

import CollectibleList from '@/app/collectible/[type]/list';
import { auth } from '@/server/auth';
import { COLLECTIBLE_TYPES } from '@/utils/consts';

export default async function CollectibleListWrapper({ params }: { params: Promise<{ type: ItemRouteKey }> }) {
  const { type } = await params;
  if (!COLLECTIBLE_TYPES.includes(type)) return notFound();

  const session = await auth();
  return <CollectibleList session={session} routeKey={type} />;
}
