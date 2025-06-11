'use client';

import { useSearchParams } from 'next/navigation';
import { type Session } from 'next-auth';
import { useCallback, useEffect, useState } from 'react';
import { type ExpandedInstance } from 'types';

import LoadingSpinner from '@/app/_components/ui/loading-spinner';
import SearchList from '@/app/search/list';
import SearchBar from '@/app/search/search-bar';

export default function SearchContent({ session }: { session: Session | null }) {
  const params = useSearchParams();
  const term = params.get('q');
  const decodedTerm = term ? decodeURIComponent(term) : '';
  const cleanTerm = decodedTerm.replace(/\+/g, ' ');
  const [items, setItems] = useState<ExpandedInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const loadItems = useCallback(async () => {
    if (loading) return;

    console.log('loadItems called, current items:', items.length);
    setLoading(true);

    try {
      const res = await fetch(`/api/search?term=${cleanTerm}`);
      const newItems = (await res.json()) as ExpandedInstance[];
      console.log('Fetched items:', items.length);

      setItems(newItems);
    } finally {
      setLoading(false);
    }
  }, [cleanTerm, items.length, loading]);

  // Reset on term change
  useEffect(() => {
    console.log('Term changed, resetting...');
    setItems([]);
    setInitialLoaded(false);
  }, [cleanTerm]);

  useEffect(() => {
    if (!initialLoaded && items.length === 0) {
      setInitialLoaded(true);
      void loadItems();
    }
  }, [initialLoaded, items.length, loadItems]);

  return (
    <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
      <SearchBar />
      {cleanTerm.length > 0 && (
        <>
          <h1 className="text-center text-base font-bold md:text-xl">Search Results for &ldquo;{cleanTerm}&rdquo;</h1>
          {loading && <LoadingSpinner />}
          {items && !loading && <SearchList items={items} session={session} />}{' '}
        </>
      )}
    </div>
  );
}
