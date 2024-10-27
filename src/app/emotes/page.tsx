import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const EmoteList = dynamic(() => import('./EmoteList'));

export default async function EmoteListWrapper() {
  const initialEmotes = await api.emotes.getAll({ limit: 15 });
  const session = await getServerAuthSession();

  return (
    <Suspense fallback={<Loading />}>
      <EmoteList session={session} initialEmotes={initialEmotes} />
    </Suspense>
  );
}
