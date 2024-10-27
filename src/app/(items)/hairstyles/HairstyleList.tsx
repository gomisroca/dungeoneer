'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import ItemCard from '@/app/_components/ItemCard';

type HairstyleListOutput = RouterOutputs['hairstyles']['getAll'];
interface HairstyleListProps {
  session: Session | null;
  initialHairstyles: HairstyleListOutput;
}
export default function HairstyleList({ session, initialHairstyles }: HairstyleListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.hairstyles.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialHairstyles], pageParams: [undefined] },
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

  const allHairstyles = data?.pages.flatMap((page) => page.hairstyles) ?? [];

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching posts</h1>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {allHairstyles.map((hairstyle, index) => (
              <div key={hairstyle.id} ref={index === allHairstyles.length - 1 ? ref : undefined}>
                <ItemCard item={hairstyle} type="hairstyles" session={session} />
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
