'use client';

import { useEffect, useState } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import { type Session } from 'next-auth';
import ItemCard from '@/app/_components/ItemCard';
import Filter from '@/app/_components/Filter';
import { useItemFilter } from '@/hooks/useItemFilter';

type CardListOutput = RouterOutputs['cards']['getAll'];
interface CardListProps {
  session: Session | null;
  initialCards: CardListOutput;
}
export default function CardList({ session, initialCards }: CardListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.cards.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialCards], pageParams: [undefined] },
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

  const allCards = data?.pages.flatMap((page) => page.cards) ?? [];

  const [filter, setFilter] = useState<boolean>(false);
  const filteredCards = useItemFilter(allCards, filter, session);

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
            {filteredCards.map((card, index) => (
              <div key={card.id} ref={index === filteredCards.length - 1 ? ref : undefined}>
                <ItemCard item={card} type="cards" session={session} />
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
