import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const OrchestrionList = dynamic(() => import('./OrchestrionList'));

export default async function OrchestrionListWrapper() {
  const initialOrchestrions = await api.orchestrions.getAll({ limit: 15 });
  const session = await getServerAuthSession();

  return (
    <Suspense fallback={<Loading />}>
      <OrchestrionList session={session} initialOrchestrions={initialOrchestrions} />
    </Suspense>
  );
}
