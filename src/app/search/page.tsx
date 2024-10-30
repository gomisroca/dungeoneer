import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import SearchList from './SearchList';
import SearchBar from './SearchBar';

export default async function Search({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const session = await getServerAuthSession();
  const params = await searchParams;
  if (!params.q) {
    return (
      <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
        <SearchBar />
      </div>
    );
  }
  const decodedTerm = decodeURIComponent(params.q);
  const cleanTerm = decodedTerm.replace(/\+/g, ' ');

  const items = await api.misc.search({ term: cleanTerm });

  return (
    <div>
      {cleanTerm.length > 0 && (
        <h1 className="text-center text-xl font-bold">Search Results for &ldquo;{cleanTerm}&rdquo;</h1>
      )}
      <SearchList items={items} session={session} />
    </div>
  );
}
