import InstanceCard from '@/app/_components/InstanceCard';
import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import { type Session } from 'next-auth';
import { Suspense } from 'react';
import { type ExpandedDungeon, type ExpandedRaid, type ExpandedTrial, type ExpandedVariantDungeon } from 'types';

interface SearchListProps {
  items: ExpandedDungeon[] | ExpandedRaid[] | ExpandedTrial[] | ExpandedVariantDungeon[];
  session: Session | null;
}
function SearchList({ items, session }: SearchListProps) {
  return (
    <div className="flex flex-col space-y-4">
      {items.map((item) => (
        <InstanceCard key={item.id} instance={item} session={session} />
      ))}
    </div>
  );
}

export default async function Search({ params }: Readonly<{ params: { term: string } }>) {
  const session = await getServerAuthSession();
  const encodedTerm = params.term;
  const decodedTerm = decodeURIComponent(encodedTerm);
  const cleanTerm = decodedTerm.replace(/\+/g, ' ');

  const items = await api.misc.search({ term: cleanTerm });

  if (!items || items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center">
        <p>No results were found 😞</p>
        <p>Please try again</p>
      </div>
    );
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchList items={items} session={session} />
    </Suspense>
  );
}
