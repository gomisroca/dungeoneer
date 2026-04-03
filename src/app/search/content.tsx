'use client';

import { useSearchParams } from 'next/navigation';
import { type Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { type ExpandedInstance } from 'types';

import LoadingSpinner from '@/app/_components/ui/loading-spinner';
import SearchList from '@/app/search/list';
import SearchBar from '@/app/search/search-bar';

export default function SearchContent({ session }: { session: Session | null }) {
  const params = useSearchParams();
  const term = params.get('q') ?? '';
  const cleanTerm = decodeURIComponent(term).replace(/\+/g, ' ');

  const [items, setItems] = useState<ExpandedInstance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cleanTerm.trim()) {
      setItems([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?term=${encodeURIComponent(cleanTerm)}`)
      .then((res) => res.json())
      .then((data) => setItems(data as ExpandedInstance[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cleanTerm]);

  return (
    <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
      <SearchBar />
      {cleanTerm.length > 0 && (
        <>
          <h1 className="text-center text-base font-bold md:text-xl">Search Results for &ldquo;{cleanTerm}&rdquo;</h1>
          {loading && <LoadingSpinner />}
          {!loading && <SearchList items={items} session={session} />}
        </>
      )}
    </div>
  );
}
