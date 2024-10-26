'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import OrchestrionCard from './OrchestrionCard';

type OrchestrionListOutput = RouterOutputs['orchestrions']['getAll'];
interface OrchestrionListProps {
  session: Session | null;
  initialOrchestrions: OrchestrionListOutput;
}
export default function OrchestrionList({ session, initialOrchestrions }: OrchestrionListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.orchestrions.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialOrchestrions], pageParams: [undefined] },
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

  const allOrchestrions = data?.pages.flatMap((page) => page.orchestrions) ?? [];

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching posts</h1>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {allOrchestrions.map((orchestrion, index) => (
              <div key={orchestrion.id} ref={index === allOrchestrions.length - 1 ? ref : undefined}>
                <OrchestrionCard orchestrion={orchestrion} session={session} />
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
