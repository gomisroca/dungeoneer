'use client';

import { useSearchParams } from 'next/navigation';
import { type Session } from 'next-auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type ExpandedInstance } from 'types';

import { InstanceCard } from '@/app/_components/cards';
import FilterMenu from '@/app/_components/filter-menu';
import { InstanceCardSkeleton, InstanceListItemSkeleton } from '@/app/_components/ui/skeletons';
import VirtualItem from '@/app/_components/ui/virtual-item';
import ViewToggler from '@/app/_components/view-toggler';
import { useInstanceFilter } from '@/hooks/useInstanceFilter';

import InstanceListItem from './item';

interface InstanceListProps {
  session: Session | null;
  routeKey: 'dungeons' | 'raids' | 'trials' | 'variants';
  itemsPerPage?: number;
}

export default function InstanceList({ session, routeKey }: InstanceListProps) {
  const searchParams = useSearchParams();
  const expansion = searchParams.get('ex') ?? undefined;

  const [instances, setInstances] = useState<ExpandedInstance[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [filter, setFilter] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);

  const loadInstances = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/instance?type=${routeKey}&expansion=${expansion ?? ''}&skip=${instances.length}&take=30`
      );
      const { instances: newInstances, hasMore: newHasMore } = await res.json();
      console.log('Fetched instances:', newInstances.length, 'hasMore:', newHasMore);

      setInstances((prev) => {
        // Prevent duplicates by checking if we already have these items
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = newInstances.filter((item: ExpandedInstance) => !existingIds.has(item.id));
        console.log('Adding unique items:', uniqueNewItems.length);
        return [...prev, ...uniqueNewItems];
      });
      setHasMore(newHasMore);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, instances.length, routeKey, expansion]);

  // Reset on expansion change
  useEffect(() => {
    console.log('Expansion changed, resetting...');
    setInstances([]);
    setHasMore(true);
    setInitialLoaded(false);
  }, [expansion]);

  // Initial load only
  useEffect(() => {
    if (!initialLoaded && instances.length === 0) {
      console.log('Initial load triggered');
      setInitialLoaded(true);
      loadInstances();
    }
  }, [initialLoaded, instances.length, loadInstances]);

  // Intersection observer setup - separate from loadInstances to avoid re-creation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loading && hasMore && initialLoaded) {
          console.log('Intersection observer triggered load');
          loadInstances();
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

  const filteredInstances = useInstanceFilter({ instances, filter, session });

  return (
    <div className="relative flex flex-col">
      <ViewToggler onViewChange={setView} />
      <FilterMenu onFilterChange={setFilter} />
      {view ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredInstances.map((instance) => (
            <VirtualItem key={instance.id} placeholder={<InstanceCardSkeleton />} height={200}>
              <InstanceCard instance={instance} session={session} />
            </VirtualItem>
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-2">
          {filteredInstances.map((instance) => (
            <VirtualItem key={instance.id} placeholder={<InstanceListItemSkeleton />} height={200}>
              <InstanceListItem instance={instance} session={session} />
            </VirtualItem>
          ))}
        </div>
      )}
      <div ref={observerRef} className="mt-8 flex h-16 items-center justify-center">
        {loading && <span>Loading more...</span>}
        {!hasMore && <span>No more instances.</span>}
      </div>
    </div>
  );
}
