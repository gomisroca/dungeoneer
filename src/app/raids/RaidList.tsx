'use client';

import { useEffect, useMemo, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import InstanceCard from '../_components/InstanceCard';
import Button from '../_components/ui/Button';
import { FaFilter } from 'react-icons/fa6';
import { type ExpandedRaid } from 'types';
import checkOwnership from '@/utils/checkOwnership';

type RaidListOutput = RouterOutputs['raids']['getAll'];
interface RaidListProps {
  initialRaids: RaidListOutput;
  session: Session | null;
}
export default function RaidList({ initialRaids, session }: RaidListProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState('all');
  const [filteredRaids, setFilteredRaids] = useState<ExpandedRaid[]>([]);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.raids.getAll.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialRaids], pageParams: [undefined] },
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

  const allRaids = useMemo(() => data?.pages.flatMap((page) => page.raids) ?? [], [data]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredRaids(allRaids);
    }
    if (filter === 'owned') {
      setFilteredRaids(allRaids.filter((dungeon) => checkOwnership(dungeon, session)));
    }
    if (filter === 'unowned') {
      setFilteredRaids(allRaids.filter((dungeon) => !checkOwnership(dungeon, session)));
    }
  }, [filter, allRaids, session]);

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching raids</h1>
      ) : (
        <>
          {session && (
            <div className="fixed right-12 top-0 z-20 flex flex-col items-end justify-end gap-2 p-4 md:right-20">
              <Button
                onClick={() => setShowFilter(!showFilter)}
                className="h-[35px] w-[35px] p-2 md:h-full md:w-full md:p-4">
                <FaFilter size={20} />
              </Button>
              {showFilter && (
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'w-28 bg-cyan-400 p-2 dark:bg-cyan-600 md:p-4' : 'w-28 p-2 md:p-4'}>
                    All
                  </Button>
                  <Button
                    onClick={() => setFilter('owned')}
                    className={filter === 'owned' ? 'w-28 bg-cyan-400 p-2 dark:bg-cyan-600 md:p-4' : 'w-28 p-2 md:p-4'}>
                    Owned
                  </Button>
                  <Button
                    onClick={() => setFilter('unowned')}
                    className={
                      filter === 'unowned' ? 'w-28 bg-cyan-400 p-2 dark:bg-cyan-600 md:p-4' : 'w-28 p-2 md:p-4'
                    }>
                    Unowned
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRaids.map((raid, index) => (
              <div key={raid.id} ref={index === filteredRaids.length - 1 ? ref : undefined}>
                <InstanceCard instance={raid} session={session} />
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
