'use client';

import { useEffect, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import ItemCard from '@/app/_components/ItemCard';
import { useItemFilter } from '@/hooks/useItemFilter';
import Filter from '@/app/_components/Filter';

type OrchestrionListOutput = RouterOutputs['orchestrions']['getAll'];
interface OrchestrionListProps {
  session: Session | null;
  initialOrchestrions: OrchestrionListOutput;
}
export default function OrchestrionList({ session, initialOrchestrions }: OrchestrionListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.orchestrions.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialOrchestrions], pageParams: [undefined] },
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

  const allOrchestrions = data?.pages.flatMap((page) => page.orchestrions) ?? [];

  const [filter, setFilter] = useState<boolean>(false);
  const filteredOrchestrions = useItemFilter(allOrchestrions, filter, session);

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Error fetching posts</h1>
      ) : (
        <>
          <Filter onFilterChange={setFilter} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {filteredOrchestrions.map((orchestrion, index) => (
              <div key={orchestrion.id} ref={index === filteredOrchestrions.length - 1 ? ref : undefined}>
                <ItemCard item={orchestrion} type="orchestrions" session={session} />
              </div>
            ))}
          </div>
          {isFetchingNextPage && (
            <h1 className="m-auto w-fit animate-pulse rounded-xl bg-cyan-300 p-4 text-center text-base font-bold dark:bg-cyan-700 md:text-xl">
              Loading more...
            </h1>
          )}
        </>
      )}
    </div>
  );
}
