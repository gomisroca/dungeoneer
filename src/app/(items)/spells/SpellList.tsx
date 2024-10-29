'use client';

import { useEffect, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import ItemCard from '@/app/_components/ItemCard';
import Filter from '@/app/_components/Filter';
import { useItemFilter } from '@/hooks/useItemFilter';

type SpellListOutput = RouterOutputs['spells']['getAll'];
interface SpellListProps {
  session: Session | null;
  initialSpells: SpellListOutput;
}
export default function SpellList({ session, initialSpells }: SpellListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.spells.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialSpells], pageParams: [undefined] },
    }
  );

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allSpells = data?.pages.flatMap((page) => page.spells) ?? [];

  const [filter, setFilter] = useState<boolean>(false);
  const filteredSpells = useItemFilter(allSpells, filter, session);

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching posts</h1>
      ) : (
        <>
          <Filter onFilterChange={setFilter} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {filteredSpells.map((spell, index) => (
              <div key={spell.id} ref={index === filteredSpells.length - 1 ? ref : undefined}>
                <ItemCard item={spell} type="spells" session={session} />
              </div>
            ))}
          </div>
          {isFetchingNextPage && (
            <h1 className="m-auto w-fit animate-pulse rounded-xl bg-cyan-300 p-4 text-center text-xl font-bold dark:bg-cyan-700">
              Loading more...
            </h1>
          )}
        </>
      )}
    </div>
  );
}
