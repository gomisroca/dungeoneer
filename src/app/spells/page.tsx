import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const SpellList = dynamic(() => import('./SpellList'));

export default async function MinionListWrapper() {
  const initialSpells = await api.spells.getAll({ limit: 15 });
  const session = await getServerAuthSession();
  return (
    <Suspense fallback={<Loading />}>
      <SpellList session={session} initialSpells={initialSpells} />
    </Suspense>
  );
}
