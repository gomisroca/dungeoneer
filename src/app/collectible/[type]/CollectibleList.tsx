'use client';

import { useEffect, useMemo, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
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
import { fetchItems } from '@/server/queries/items';
import { itemKeytoModel } from '@/utils/mappers';

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

  const [pages, setPages] = useState([initialCollectibles]);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState(initialCollectibles.nextCursor);
  const [hasMore, setHasMore] = useState(!!initialCollectibles.nextCursor);

  const allCollectibles = useMemo(() => pages.flatMap((page) => page.items), [pages]);

  const loadNextPage = async () => {
    if (!hasMore || isLoadingNextPage) return;
    setIsLoadingNextPage(true);

    const model = itemKeytoModel[routeKey];

    const nextPage = await fetchItems(model, {
      limit: itemsPerPage,
      cursor: nextCursor,
      expansion: EXPANSIONS[expansion as keyof typeof EXPANSIONS],
    });

    if (nextPage) {
      setPages((prev) => [...prev, nextPage]);
      setNextCursor(nextPage.nextCursor);
      setHasMore(!!nextPage.nextCursor);
    }

    setIsLoadingNextPage(false);
  };

  const [filter, setFilter] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
  // @ts-expect-error ExpandedCollectible join
  const filteredCollectibles = useItemFilter({ items: allCollectibles, filter, session });

  const { ref, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  useEffect(() => {
    const fetchInitial = async () => {
      const model = itemKeytoModel[routeKey];
      const fresh = await fetchItems(model, {
        limit: itemsPerPage,
        expansion: EXPANSIONS[expansion as keyof typeof EXPANSIONS],
      });

      if (fresh) {
        setPages([fresh]);
        setNextCursor(fresh.nextCursor);
        setHasMore(!!fresh.nextCursor);
      }
    };

    void fetchInitial();
  }, [expansion, routeKey]);

  useEffect(() => {
    if (entry?.isIntersecting && hasMore && !isLoadingNextPage) {
      void loadNextPage();
    }
  }, [entry, hasMore, isLoadingNextPage]);

  return (
    <div className="relative flex flex-col">
      {pages.length === 0 ? (
        <LoadingSpinner />
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
            <div className="grid grid-cols-1 space-y-2 gap-x-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCollectibles.map((collectible, index) => (
                <div key={collectible.id} ref={index === filteredCollectibles.length - 1 ? ref : undefined}>
                  <CollectibleListItem item={collectible} type={routeKey} session={session} />
                </div>
              ))}
            </div>
          )}
          {isLoadingNextPage && <LoadingSpinner />}
        </>
      )}
    </div>
  );
}
