import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import { Suspense } from 'react';
import Loading from './loading';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { COLLECTIBLE_TYPES, EXPANSIONS } from '@/utils/consts';

const CollectibleList = dynamic(() => import('./CollectibleList'));

export default async function CollectibleListWrapper({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const type = (await params).type;
  if (!type || !COLLECTIBLE_TYPES.includes(type)) return notFound();
  const routeKey = type as 'cards' | 'minions' | 'mounts' | 'spells' | 'orchestrions' | 'emotes' | 'hairstyles';

  const expansion = searchParams?.ex ?? undefined;

  const initialCollectibles = await api[routeKey].getAll({
    limit: 30,
    expansion: EXPANSIONS[expansion as keyof typeof EXPANSIONS],
  });
  const session = await getServerAuthSession();

  return (
    <Suspense fallback={<Loading />}>
      <CollectibleList session={session} initialCollectibles={initialCollectibles} routeKey={routeKey} />
    </Suspense>
  );
}
