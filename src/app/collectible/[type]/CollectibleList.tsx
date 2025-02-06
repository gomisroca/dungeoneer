'use client';

import { useEffect, useMemo, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api } from '@/trpc/react';
import { type Session } from 'next-auth';
import { useItemFilter } from '@/hooks/useItemFilter';
import ViewToggler from '@/app/_components/ViewToggler';
import ItemCard from '@/app/_components/ItemCard';
import { type ExpandedCollectible } from 'types';
import CollectibleListItem from './CollectibleListItem';
import LoadingSpinner from '@/app/_components/ui/LoadingSpinner';
import FilterMenu from '@/app/_components/FilterMenu';
import { useSearchParams } from 'next/navigation';
import { EXPANSIONS } from '@/utils/consts';

type CollectibleListOutput<T> = {
  items: T[];
  nextCursor: string | undefined;
};

interface CollectibleListProps<T extends ExpandedCollectible> {
  initialCollectibles: CollectibleListOutput<T>;
  session: Session | null;
  routeKey: 'cards' | 'minions' | 'mounts' | 'spells' | 'orchestrions' | 'emotes' | 'hairstyles';
  itemsPerPage?: number;
}

export default function CollectibleList<T extends ExpandedCollectible>({
  initialCollectibles,
  session,
  routeKey,
  itemsPerPage = 30,
}: CollectibleListProps<T>) {
  const searchParams = useSearchParams();
  const expansion = searchParams.get('ex') ?? undefined;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch } = api[
    routeKey
  ].getAll.useInfiniteQuery(
    {
      limit: itemsPerPage,
      expansion: EXPANSIONS[expansion as keyof typeof EXPANSIONS],
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      // @ts-expect-error ExpandedCollectible join
      initialData: { pages: [initialCollectibles], pageParams: [undefined] },
    }
  );

  // @ts-expect-error ExpandedCollectible join
  const allCollectibles = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const [filter, setFilter] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  // @ts-expect-error ExpandedCollectible join
  const filteredCollectibles = useItemFilter({ items: allCollectibles, filter, session });

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    void refetch();
  }, [expansion, refetch]);

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="relative flex flex-col">
      {status === 'pending' ? (
        <LoadingSpinner />
      ) : status === 'error' ? (
        <h1 className="p-4 text-base font-bold md:text-xl">Error fetching {routeKey}</h1>
      ) : (
        <>
          <ViewToggler onViewChange={setView} />
          <FilterMenu onFilterChange={setFilter} />
          {view ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCollectibles.map((collectible, index) => (
                <div key={collectible.id} ref={index === filteredCollectibles.length - 1 ? ref : undefined}>
                  <ItemCard item={collectible} type={routeKey} session={session} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-4 space-y-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCollectibles.map((collectible, index) => (
                <div key={collectible.id} ref={index === filteredCollectibles.length - 1 ? ref : undefined}>
                  <CollectibleListItem item={collectible} type={routeKey} session={session} />
                </div>
              ))}
            </div>
          )}
          {isFetchingNextPage && <LoadingSpinner />}
        </>
      )}
    </div>
  );
}
