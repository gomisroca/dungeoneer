import PageChange from '@/app/sync/search/page-change';
import SearchBar from '@/app/sync/search/search-bar';
import LodestoneSearchList from '@/app/sync/search/search-list';
import { fetchLodestoneCharacters } from '@/server/queries/lodestone';

export default async function LodestoneSearch({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { name, server, dc, page } = await searchParams;

  if (!name) {
    return (
      <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-100">
        <SearchBar />
      </div>
    );
  }

  const data = await fetchLodestoneCharacters({
    name: name as string,
    server: server as string,
    dc: dc as string,
    page: (page as string) ?? '1',
  });

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-start gap-4 p-4">
      <SearchBar />
      <h1 className="text-center text-base font-bold md:text-xl">Search Results for &ldquo;{name}&rdquo;</h1>
      <LodestoneSearchList characters={data.characters} />
      <PageChange pagination={data.pagination} />
    </div>
  );
}
