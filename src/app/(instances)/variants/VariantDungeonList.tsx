'use client';

import { useEffect, useMemo, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import InstanceCard from '@/app/_components/InstanceCard';
import Filter from '@/app/_components/Filter';
import { useInstanceFilter } from '@/hooks/useInstanceFilter';

type VariantDungeonListOutput = RouterOutputs['variants']['getAll'];
interface VariantDungeonListProps {
  initialDungeons: VariantDungeonListOutput;
  session: Session | null;
}
export default function VariantDungeonList({ initialDungeons, session }: VariantDungeonListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.variants.getAll.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialDungeons], pageParams: [undefined] },
    }
  );

  const allVariants = useMemo(() => data?.pages.flatMap((page) => page.dungeons) ?? [], [data]);

  const [filter, setFilter] = useState<boolean>(false);
  const filteredVariants = useInstanceFilter(allVariants, filter, session);

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
        <h1 className="p-4 text-base font-bold md:text-xl">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Error fetching dungeons</h1>
      ) : (
        <>
          <Filter onFilterChange={setFilter} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredVariants.map((dungeon, index) => (
              <div key={dungeon.id} ref={index === filteredVariants.length - 1 ? ref : undefined}>
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
