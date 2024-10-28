'use client';

import { useEffect, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import ItemCard from '@/app/_components/ItemCard';
import { useItemFilter } from '@/hooks/useItemFilter';
import Filter from '@/app/_components/Filter';

type EmoteListOutput = RouterOutputs['emotes']['getAll'];
interface EmoteListProps {
  session: Session | null;
  initialEmotes: EmoteListOutput;
}
export default function EmoteList({ session, initialEmotes }: EmoteListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.emotes.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialEmotes], pageParams: [undefined] },
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

  const allEmotes = data?.pages.flatMap((page) => page.emotes) ?? [];

  const [filter, setFilter] = useState<boolean>(false);
  const filteredEmotes = useItemFilter(allEmotes, filter, session);

  return (
    <div className="flex flex-col space-y-4">
      {status === 'pending' ? (
        <h1 className="p-4 text-xl font-bold">Loading...</h1>
      ) : status === 'error' ? (
        <h1 className="p-4 text-xl font-bold">Error fetching posts</h1>
      ) : (
        <>
          {session && <Filter onFilterChange={setFilter} />}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {filteredEmotes.map((emote, index) => (
              <div key={emote.id} ref={index === filteredEmotes.length - 1 ? ref : undefined}>
                <ItemCard item={emote} type="emotes" session={session} />
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
