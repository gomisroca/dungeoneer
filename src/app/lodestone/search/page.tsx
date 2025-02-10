'use client';

import { api } from '@/trpc/react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/app/_components/ui/LoadingSpinner';
import SearchBar from './SearchBar';
import LodestoneSearchList from './SearchList';
import Button from '@/app/_components/ui/Button';
import { type LodestoneCharacter } from 'types';

export default function LodestoneSearch() {
  const router = useRouter();
  const params = useSearchParams();

  const decodeParam = (param: string | null) => (param ? decodeURIComponent(param).replace(/\+/g, ' ') : '');

  const name = decodeParam(params.get('name'));
  const server = decodeParam(params.get('server'));
  const dc = decodeParam(params.get('dc'));
  const page = decodeParam(params.get('page'));

  const {
    data,
    isLoading,
  }: {
    data:
      | {
          characters: LodestoneCharacter[];
          pagination: {
            current: string;
            total: string;
            prev: string | null;
            next: string | null;
          };
        }
      | undefined;
    isLoading: boolean;
  } = api.lodestone.search.useQuery({ name, server, dc, page }, { enabled: !!name });

  const handlePageChange = (page: number) => {
    router.replace(`?name=${name}&dc=${dc}&server=${server}&page=${Number(page)}`);
  };

  if (!name) {
    return (
      <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
        <SearchBar />
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-start gap-4 p-4">
      <SearchBar />
      {name.length > 0 && (
        <h1 className="text-center text-base font-bold md:text-xl">Search Results for &ldquo;{name}&rdquo;</h1>
      )}
      {isLoading && <LoadingSpinner />}
      {data?.characters && <LodestoneSearchList characters={data.characters} />}
      <section className="flex items-center justify-center gap-2">
        {data?.pagination?.prev !== 'javascript:void(0);' && (
          <Button
            onClick={() => handlePageChange(Number(page) - 1)}
            disabled={isLoading || page === '1' || !data?.pagination?.prev}>
            {Number(page) - 1}
          </Button>
        )}
        <span className="rounded-xl p-4 text-lg font-bold">{data?.pagination?.current}</span>
        {data?.pagination?.next !== 'javascript:void(0);' && (
          <Button
            onClick={() => handlePageChange(Number(page) + 1)}
            disabled={isLoading || page === data?.pagination.total || !data?.pagination?.next}>
            {Number(page) + 1}
          </Button>
        )}
      </section>
    </div>
  );
}
