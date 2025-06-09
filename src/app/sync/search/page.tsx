import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/app/_components/ui/LoadingSpinner';
import SearchBar from './search-bar';
import LodestoneSearchList from './search-list';
import { fetchLodestoneCharacters } from '@/server/queries/lodestone';
import PageChange from './page-change';

export default async function LodestoneSearch({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const name = (await searchParams).name as string;
  const server = (await searchParams).server as string;
  const dc = (await searchParams).dc as string;
  const page = (await searchParams).page as string;

  const data = await fetchLodestoneCharacters({ name, server, dc, page });

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
      {!data && <LoadingSpinner />}
      {data.characters && (
        <>
          <LodestoneSearchList characters={data.characters} />
          <PageChange pagination={data.pagination} />
        </>
      )}
    </div>
  );
}
