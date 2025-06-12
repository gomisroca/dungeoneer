'use client';

import { useSearchParams } from 'next/navigation';
import { type Session } from 'next-auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type ExpandedCollectible } from 'types';

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
  routeKey: 'cards' | 'minions' | 'mounts' | 'spells' | 'orchestrions' | 'emotes' | 'hairstyles';
  itemsPerPage?: number;
}

export default function CollectibleList({ session, routeKey }: CollectibleListProps) {
  const searchParams = useSearchParams();
  const expansion = searchParams.get('ex') ?? undefined;

  const [items, setItems] = useState<ExpandedCollectible[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [filter, setFilter] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);

  const loadItems = useCallback(async () => {
    if (loading || !hasMore) return;

    console.log('loadItems called, current items:', items.length);
    setLoading(true);

    try {
      const res = await fetch(
        `/api/collectible?type=${routeKey}&expansion=${expansion ?? ''}&skip=${items.length}&take=50`
      );
      const { items: newItems, hasMore: newHasMore } = (await res.json()) as {
        items: ExpandedCollectible[];
        hasMore: boolean;
      };
      console.log('Fetched items:', newItems.length, 'hasMore:', newHasMore);

      setItems((prev) => {
        // Prevent duplicates by checking if we already have these items
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = newItems.filter((item: ExpandedCollectible) => !existingIds.has(item.id));
        console.log('Adding unique items:', uniqueNewItems.length);
        return [...prev, ...uniqueNewItems];
      });
      setHasMore(newHasMore);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, items.length, routeKey, expansion]);

  // Reset on expansion change
  useEffect(() => {
    console.log('Expansion changed, resetting...');
    setItems([]);
    setHasMore(true);
    setInitialLoaded(false);
  }, [expansion]);

  // Initial load only
  useEffect(() => {
    if (!initialLoaded && items.length === 0) {
      console.log('Initial load triggered');
      setInitialLoaded(true);
      void loadItems();
    }
  }, [initialLoaded, items.length, loadItems]);

  // Intersection observer setup - separate from loadItems to avoid re-creation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasMore && initialLoaded) {
          console.log('Intersection observer triggered load');
          void loadItems();
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [loading, hasMore, initialLoaded]); // Remove loadItems from dependencies

  // @ts-expect-error ExpandedCollectible join
  const filteredCollectibles = useItemFilter({ items, filter, session });

  return (
    <div className="relative flex flex-col">
      <ViewToggler onViewChange={setView} />
      <FilterMenu onFilterChange={setFilter} />
      {view ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCollectibles.map((collectible) => (
            <VirtualItem
              key={collectible.id}
              placeholder={
                <ItemCardSkeleton owned={collectible.owners.some((owner) => owner.id === session?.user.id)} />
              }
              height={200}>
              <ItemCard item={collectible} type={routeKey} session={session} />
            </VirtualItem>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 space-y-2 gap-x-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCollectibles.map((collectible) => (
            <VirtualItem
              key={collectible.id}
              placeholder={
                <CollectibleListItemSkeleton
                  owned={collectible.owners.some((owner) => owner.id === session?.user.id)}
                />
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
