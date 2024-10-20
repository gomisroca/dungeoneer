// src/components/InfinitePostList.tsx
'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api } from '@/trpc/react';
import Image from 'next/image';

export default function MinionList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.minion.getAll.useInfiniteQuery(
    {
      limit: 30,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching posts</h1>
      ) : (
        <>
          {data?.pages.map((page, i) => (
            <div className="grid grid-cols-5" key={i}>
              {page.minions.map((minion, index) => (
                <div
                  key={minion.id}
                  ref={index === page.minions.length - 1 ? ref : undefined}
                  className="rounded-xl p-4 font-semibold transition duration-200 ease-in-out hover:scale-110 hover:cursor-pointer hover:bg-cyan-300 hover:text-stone-900 dark:hover:bg-cyan-700 dark:hover:text-stone-100">
                  {minion.image && <Image src={minion.image} alt={minion.name} width={100} height={100} />}
                  {minion.name}
                </div>
              ))}
            </div>
          ))}
          {isFetchingNextPage && <h1 className="p-4 text-xl font-bold">Loading more...</h1>}
        </>
      )}
    </div>
  );
}
