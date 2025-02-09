'use client';

import { api } from '@/trpc/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import LoadingSpinner from '@/app/_components/ui/LoadingSpinner';
import SearchBar from './SearchBar';
import LodestoneSearchList from './SearchList';
import Button from '@/app/_components/ui/Button';

export default function LodestoneSearch() {
  const params = useSearchParams();
  const [page, setPage] = useState(0);

  const decodeParam = (param: string | null) => (param ? decodeURIComponent(param).replace(/\+/g, ' ') : '');

  const name = decodeParam(params.get('name'));
  const server = decodeParam(params.get('server'));
  const dc = decodeParam(params.get('dc'));

  const { data, isLoading } = api.lodestone.search.useQuery({ name, server, dc, page }, { enabled: !!name });

  const handlePageChange = () => {
    if (data?.pagination?.next) {
      setPage(data.pagination.next);
    }
  };

  if (!name) {
    return (
      <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
        <SearchBar />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
      <SearchBar />
      {name.length > 0 && (
        <h1 className="text-center text-base font-bold md:text-xl">Search Results for &ldquo;{name}&rdquo;</h1>
      )}
      {isLoading && <LoadingSpinner />}
      {data?.characters && <LodestoneSearchList characters={data.characters} />}
      {data?.pagination?.next && (
        <Button onClick={handlePageChange} disabled={isLoading}>
          Next Page
        </Button>
      )}
    </div>
  );
}
