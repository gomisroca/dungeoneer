import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const TrialList = dynamic(() => import('./TrialList'));

export default async function TrialListWrapper() {
  const initialTrials = await api.trials.getAll({ limit: 30 });
  const session = await getServerAuthSession();
  return (
    <Suspense fallback={<Loading />}>
      <TrialList session={session} initialTrials={initialTrials} />
    </Suspense>
  );
}
