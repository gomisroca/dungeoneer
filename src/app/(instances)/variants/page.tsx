import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import dynamic from 'next/dynamic';
import Loading from './loading';
import { Suspense } from 'react';

const VariantDungeonList = dynamic(() => import('./VariantDungeonList'));

export default async function VariantDungeonListWrapper() {
  const initialDungeons = await api.variants.getAll({ limit: 30 });
  const session = await getServerAuthSession();
  return (
    <Suspense fallback={<Loading />}>
      <VariantDungeonList session={session} initialDungeons={initialDungeons} />
    </Suspense>
  );
}
