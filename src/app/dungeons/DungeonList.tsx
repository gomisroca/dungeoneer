'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import Image from 'next/image';
import { type ExpandedMinion, type ExpandedDungeon } from 'types';
import { minionsInLS } from '../minions/MinionList';
import { type Session } from 'next-auth';

function MinionView({ minion, session }: { minion: ExpandedMinion; session: Session | null }) {
  const isOwnedByUser = session?.user
    ? minion.owners.some((o) => o.id === session.user.id)
    : minionsInLS.value.includes(minion.id);

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {minion.image && <Image src={minion.image} alt={minion.name} width={30} height={30} />}
      <h1 className={isOwnedByUser ? 'text-stone-500' : ''}>{minion.name}</h1>
    </div>
  );
}

function DungeonCard({ dungeon, session }: { dungeon: ExpandedDungeon; session: Session | null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-stone-200 bg-stone-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-stone-800 dark:bg-stone-700">
      {dungeon.image && (
        <Image src={dungeon.image} alt={dungeon.name} width={100} height={100} className="w-full object-cover" />
      )}
      <h1 className="line-clamp-2 text-center text-xl">{dungeon.name}</h1>
      {dungeon.minions?.map((minion) => <MinionView key={minion.id} minion={minion} session={session} />)}
    </div>
  );
}

type DungeonListOutput = RouterOutputs['dungeons']['getAll'];
interface DungeonListProps {
  initialDungeons: DungeonListOutput;
  session: Session | null;
}
export default function DungeonList({ initialDungeons, session }: DungeonListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = api.dungeons.getAll.useInfiniteQuery(
    {
      limit: 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: { pages: [initialDungeons], pageParams: [undefined] },
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5" key={i}>
              {page.dungeons.map((dungeon, index) => (
                <div key={dungeon.id} ref={index === page.dungeons.length - 1 ? ref : undefined}>
                  <DungeonCard dungeon={dungeon} session={session} />
                </div>
              ))}
            </div>
          ))}
          {isFetchingNextPage && (
            <h1 className="m-auto w-fit animate-pulse rounded-xl bg-orange-300 p-4 text-center text-xl font-bold dark:bg-orange-700">
              Loading more...
            </h1>
          )}
        </>
      )}
    </div>
  );
}
