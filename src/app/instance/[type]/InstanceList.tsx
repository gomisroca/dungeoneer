'use client';

import { useEffect, useMemo, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api } from '@/trpc/react';
import { type Session } from 'next-auth';
import InstanceCard from '@/app/_components/InstanceCard';
import { useInstanceFilter } from '@/hooks/useInstanceFilter';
import Filter from '@/app/_components/Filter';
import ViewToggler from '@/app/_components/ViewToggler';
import { type Instance } from 'types';
import InstanceListItem from './InstanceListItem';

type InstanceListOutput<T> = {
  items: T[];
  nextCursor: number | undefined;
};

interface InstanceListProps<T extends Instance> {
  initialInstances: InstanceListOutput<T>;
  session: Session | null;
  routeKey: 'dungeons' | 'raids' | 'trials' | 'variants';
  itemsPerPage?: number;
}

export default function InstanceList<T extends Instance>({
  initialInstances,
  session,
  routeKey,
  itemsPerPage = 9,
}: InstanceListProps<T>) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api[routeKey].getAll.useInfiniteQuery(
    {
      limit: itemsPerPage,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialInstances], pageParams: [undefined] },
    }
  );

  const allInstances = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const [filter, setFilter] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  const filteredInstances = useInstanceFilter(allInstances, filter, session);

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
    <div className="relative flex flex-col">
      {status === 'pending' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Error fetching {routeKey}</h1>
      ) : (
        <>
          <ViewToggler onViewChange={setView} />
          <Filter onFilterChange={setFilter} />
          {view ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredInstances.map((instance, index) => (
                <div key={instance.id} ref={index === filteredInstances.length - 1 ? ref : undefined}>
                  <InstanceCard instance={instance} session={session} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {filteredInstances.map((instance, index) => (
                <div key={instance.id} ref={index === filteredInstances.length - 1 ? ref : undefined}>
                  <InstanceListItem instance={instance} session={session} />
                </div>
              ))}
            </div>
          )}
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
