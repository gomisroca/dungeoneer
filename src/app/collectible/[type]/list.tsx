'use client';

import { useSearchParams } from 'next/navigation';
import { type Session } from 'next-auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type ExpandedCollectible, type ItemRouteKey } from 'types';

import FilterMenu from '@/app/_components/filter-menu';
import { ItemCard } from '@/app/_components/ui/cards';
import LoadingSpinner from '@/app/_components/ui/loading-spinner';
import { CollectibleListItemSkeleton, ItemCardSkeleton } from '@/app/_components/ui/skeletons';
import VirtualItem from '@/app/_components/ui/virtual-item';
import ViewToggler from '@/app/_components/view-toggler';
import CollectibleListItem from '@/app/collectible/[type]/item';
import { useItemFilter } from '@/hooks/useItemFilter';

interface CollectibleListProps {
  session: Session | null;
  routeKey: ItemRouteKey;
}

export default function CollectibleList({ session, routeKey }: CollectibleListProps) {
  const searchParams = useSearchParams();
  const expansion = searchParams.get('ex') ?? undefined;

  const [items, setItems] = useState<ExpandedCollectible[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [view, setView] = useState(false);
  const skipRef = useRef(0);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadItems = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/collectible?type=${routeKey}&expansion=${expansion ?? ''}&skip=${skipRef.current}&take=50`
      );
      const { items: newItems, hasMore: newHasMore } = (await res.json()) as {
        items: ExpandedCollectible[];
        hasMore: boolean;
      };

      setItems((prev) => [...prev, ...newItems]);
      skipRef.current += newItems.length;
      setHasMore(newHasMore);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, routeKey, expansion]);

  // Reset and reload on expansion change
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    skipRef.current = 0;
    void loadItems();
  }, [expansion]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !loading && hasMore) void loadItems();
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loading, hasMore, loadItems]);

  const filteredCollectibles = useItemFilter({ items, filter, session });

  return (
    <div className="relative flex w-full flex-col">
      <ViewToggler onViewChange={setView} />
      <FilterMenu filter={filter} onFilterChange={setFilter} />
      {view ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCollectibles.map((collectible) => (
            <VirtualItem
              key={collectible.id}
              placeholder={<ItemCardSkeleton owned={collectible.owners.some((o) => o.id === session?.user?.id)} />}
              height={200}>
              <ItemCard item={collectible} type={routeKey} session={session} />
            </VirtualItem>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 space-y-2 gap-x-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredCollectibles.map((collectible) => (
            <VirtualItem
              key={collectible.id}
              placeholder={
                <CollectibleListItemSkeleton owned={collectible.owners.some((o) => o.id === session?.user?.id)} />
              }
              height={200}>
              <CollectibleListItem item={collectible} type={routeKey} session={session} />
            </VirtualItem>
          ))}
        </div>
      )}
      <div ref={observerRef} className="mt-8 flex h-16 items-center justify-center">
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
}
