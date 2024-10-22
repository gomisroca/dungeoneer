'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api, type RouterOutputs } from '@/trpc/react';
import Image from 'next/image';
import { type ExpandedMinion, type ExpandedDungeon } from 'types';
import { type Session } from 'next-auth';
import { minionsInLS, useMinionLogic } from '@/hooks/useMinionLogic';
import Button from '../_components/ui/Button';
import { twMerge } from 'tailwind-merge';

function MinionView({ minion, session }: { minion: ExpandedMinion; session: Session | null }) {
  const { addToUser, addToLS, removeFromUser, removeFromLS } = useMinionLogic(minion);
  const isOwnedByUser = session?.user
    ? minion.owners.some((o) => o.id === session.user.id)
    : minionsInLS.value.includes(minion.id);

  return (
    <Button onClick={isOwnedByUser ? (session ? removeFromUser : removeFromLS) : session ? addToUser : addToLS}>
      <div className="relative flex-shrink-0">
        {minion.image && (
          <Image
            src={minion.image}
            alt={minion.name}
            width={30}
            height={30}
            className={twMerge('flex-shrink-0', isOwnedByUser && 'opacity-75')} // Prevents the image from shrinking
          />
        )}
        {isOwnedByUser && (
          <div className="absolute bottom-0 left-0 right-0 top-0 text-center text-xl text-cyan-300 dark:text-cyan-700">
            ✔
          </div>
        )}
      </div>
      <p className={twMerge('max-w-full flex-shrink overflow-hidden text-ellipsis', isOwnedByUser && 'text-stone-500')}>
        {minion.name}
      </p>
    </Button>
  );
}

function DungeonCard({ dungeon, session }: { dungeon: ExpandedDungeon; session: Session | null }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 rounded-xl border-4 border-stone-200 bg-stone-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:rotate-2 hover:scale-125 hover:shadow-2xl dark:border-stone-800 dark:bg-stone-700">
      {dungeon.image && (
        <Image src={dungeon.image} alt={dungeon.name} width={300} height={100} className="w-full object-cover" />
      )}
      <h1 className="line-clamp-2 text-center text-xl">{dungeon.name[0]?.toUpperCase() + dungeon.name.slice(1)}</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        {dungeon.minions?.map((minion) => <MinionView key={minion.id} minion={minion} session={session} />)}
      </div>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" key={i}>
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
