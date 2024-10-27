'use client';

import { useEffect, useMemo } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import InstanceCard from '../_components/InstanceCard';

type DungeonListOutput = RouterOutputs['dungeons']['getAll'];
interface DungeonListProps {
  initialDungeons: DungeonListOutput;
  session: Session | null;
}
export default function DungeonList({ initialDungeons, session }: DungeonListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.dungeons.getAll.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialDungeons], pageParams: [undefined] },
    }
  );

  const allDungeons = useMemo(() => data?.pages.flatMap((page) => page.dungeons) ?? [], [data]);

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
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching dungeons</h1>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {allDungeons.map((dungeon, index) => (
              <div key={dungeon.id} ref={index === allDungeons.length - 1 ? ref : undefined}>
                <InstanceCard instance={dungeon} session={session} />
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
