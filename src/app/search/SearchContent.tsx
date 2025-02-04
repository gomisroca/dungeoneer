'use client';

import SearchList from './SearchList';
import SearchBar from './SearchBar';
import { type Session } from 'next-auth';
import { useSearchParams } from 'next/navigation';
import { api } from '@/trpc/react';
import LoadingSpinner from '../_components/ui/LoadingSpinner';

export default function SearchContent({ session }: { session: Session | null }) {
  const params = useSearchParams();
  const term = params.get('q');
  const decodedTerm = term ? decodeURIComponent(term) : '';
  const cleanTerm = decodedTerm.replace(/\+/g, ' ');

  const { data: items, isLoading } = api.misc.search.useQuery({ term: cleanTerm }, { enabled: !!cleanTerm });

  if (!term) {
    return (
      <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
        <SearchBar />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
      <SearchBar />
      {cleanTerm.length > 0 && (
        <h1 className="text-center text-base font-bold md:text-xl">Search Results for &ldquo;{cleanTerm}&rdquo;</h1>
      )}
      {isLoading && <LoadingSpinner />}
      {items && <SearchList items={items} session={session} />}
    </div>
  );
}
