'use client';

import { useEffect, useMemo, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import InstanceCard from '@/app/_components/InstanceCard';
import { useInstanceFilter } from '@/hooks/useInstanceFilter';
import Filter from '@/app/_components/Filter';

type TrialListtOutput = RouterOutputs['trials']['getAll'];
interface TrialListtProps {
  initialTrials: TrialListtOutput;
  session: Session | null;
}
export default function TrialList({ initialTrials, session }: TrialListtProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.trials.getAll.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialTrials], pageParams: [undefined] },
    }
  );

  const allTrials = useMemo(() => data?.pages.flatMap((page) => page.trials) ?? [], [data]);

  const [filter, setFilter] = useState<boolean>(false);
  const filteredTrials = useInstanceFilter(allTrials, filter, session);

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching trials</h1>
      ) : (
        <>
          {session && <Filter onFilterChange={setFilter} />}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTrials.map((trial, index) => (
              <div key={trial.id} ref={index === filteredTrials.length - 1 ? ref : undefined}>
                <InstanceCard instance={trial} session={session} />
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
