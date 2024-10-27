import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const HairstyleList = dynamic(() => import('./HairstyleList'));

export default async function HairstyleListWrapper() {
  const initialHairstyles = await api.hairstyles.getAll({ limit: 15 });
  const session = await getServerAuthSession();

  return (
    <Suspense fallback={<Loading />}>
      <HairstyleList session={session} initialHairstyles={initialHairstyles} />
    </Suspense>
  );
}
