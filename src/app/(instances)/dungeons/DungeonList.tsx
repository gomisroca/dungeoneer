'use client';

import { useEffect, useMemo, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import InstanceCard from '@/app/_components/InstanceCard';
import { useInstanceFilter } from '@/hooks/useInstanceFilter';
import Filter from '@/app/_components/Filter';

type DungeonListOutput = RouterOutputs['dungeons']['getAll'];
interface DungeonListProps {
  initialDungeons: DungeonListOutput;
  session: Session | null;
}
export default function DungeonList({ initialDungeons, session }: DungeonListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.dungeons.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialDungeons], pageParams: [undefined] },
    }
  );

  const allDungeons = useMemo(() => data?.pages.flatMap((page) => page.dungeons) ?? [], [data]);

  const [filter, setFilter] = useState<boolean>(false);
  const filteredDungeons = useInstanceFilter(allDungeons, filter, session);

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
    <div className="relative flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Error fetching dungeons</h1>
      ) : (
        <>
          <Filter onFilterChange={setFilter} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDungeons.map((dungeon, index) => (
              <div key={dungeon.id} ref={index === filteredDungeons.length - 1 ? ref : undefined}>
                <InstanceCard instance={dungeon} session={session} />
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
