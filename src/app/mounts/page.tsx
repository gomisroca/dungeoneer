import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const MountList = dynamic(() => import('./MountList'));

export default async function MountListWrapper() {
  const initialMounts = await api.mounts.getAll({ limit: 15 });
  const session = await getServerAuthSession();

  return (
    <Suspense fallback={<Loading />}>
      <MountList session={session} initialMounts={initialMounts} />
    </Suspense>
  );
}
