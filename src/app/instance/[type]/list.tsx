'use client';

import { useSearchParams } from 'next/navigation';
import { type Session } from 'next-auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type ExpandedInstance } from 'types';

import FilterMenu from '@/app/_components/filter-menu';
import { InstanceCard } from '@/app/_components/ui/cards';
import LoadingSpinner from '@/app/_components/ui/loading-spinner';
import { InstanceCardSkeleton, InstanceListItemSkeleton } from '@/app/_components/ui/skeletons';
import VirtualItem from '@/app/_components/ui/virtual-item';
import ViewToggler from '@/app/_components/view-toggler';
import { useInstanceFilter } from '@/hooks/useInstanceFilter';

import InstanceListItem from './item';

interface InstanceListProps {
  session: Session | null;
  routeKey: 'dungeons' | 'raids' | 'trials' | 'variants';
}

export default function InstanceList({ session, routeKey }: InstanceListProps) {
  const searchParams = useSearchParams();
  const expansion = searchParams.get('ex') ?? undefined;

  const [instances, setInstances] = useState<ExpandedInstance[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [view, setView] = useState(false);
  const skipRef = useRef(0);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadInstances = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/instance?type=${routeKey}&expansion=${expansion ?? ''}&skip=${skipRef.current}&take=30`
      );
      const { instances: newInstances, hasMore: newHasMore } = (await res.json()) as {
        instances: ExpandedInstance[];
        hasMore: boolean;
      };

      setInstances((prev) => [...prev, ...newInstances]);
      skipRef.current += newInstances.length;
      setHasMore(newHasMore);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, routeKey, expansion]);

  // Reset and reload on expansion change
  useEffect(() => {
    setInstances([]);
    setHasMore(true);
    skipRef.current = 0;
    void loadInstances();
  }, [expansion]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !loading && hasMore) void loadInstances();
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loading, hasMore, loadInstances]);

  const filteredInstances = useInstanceFilter({ instances, filter, session });

  return (
    <div className="relative flex w-full flex-col">
      <ViewToggler onViewChange={setView} />
      <FilterMenu filter={filter} onFilterChange={setFilter} />
      {view ? (
        <div className="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredInstances.map((instance) => (
            <VirtualItem key={instance.id} placeholder={<InstanceCardSkeleton />} height={200}>
              <InstanceCard instance={instance} session={session} />
            </VirtualItem>
          ))}
        </div>
      ) : (
        <div className="mx-auto flex max-w-xl flex-col space-y-2">
          {filteredInstances.map((instance) => (
            <VirtualItem key={instance.id} placeholder={<InstanceListItemSkeleton />} height={200}>
              <InstanceListItem instance={instance} session={session} />
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
