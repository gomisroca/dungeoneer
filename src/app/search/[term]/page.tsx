import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import { Suspense } from 'react';
import SearchList from './SearchList';

export default async function Search({ params }: Readonly<{ params: { term: string } }>) {
  const session = await getServerAuthSession();
  const encodedTerm = params.term;
  const decodedTerm = decodeURIComponent(encodedTerm);
  const cleanTerm = decodedTerm.replace(/\+/g, ' ');

  const items = await api.misc.search({ term: cleanTerm });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchList items={items} session={session} />
    </Suspense>
  );
}
