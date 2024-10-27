import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import Loading from './loading';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CardList = dynamic(() => import('./CardList'));

export default async function CardListWrapper() {
  const initialCards = await api.cards.getAll({ limit: 15 });
  const session = await getServerAuthSession();

  return (
    <Suspense fallback={<Loading />}>
      <CardList session={session} initialCards={initialCards} />
    </Suspense>
  );
}
