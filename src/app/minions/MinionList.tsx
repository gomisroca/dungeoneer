'use client';

import { useEffect } from 'react';
import { useIntersection } from '@mantine/hooks';
import { api } from '@/trpc/react';
import Image from 'next/image';
import { type Session } from 'next-auth';
import Button from '../_components/ui/Button';
import { type MinionWithOwners } from 'types';

function MinionCard({ minion, session }: { minion: MinionWithOwners; session: Session | null }) {
  const utils = api.useUtils();

  const addToUserMutatiom = api.minion.addToUser.useMutation({
    onSuccess: async () => {
      alert('Added to your collection!');
      await utils.minion.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const addToUser = async () => {
    addToUserMutatiom.mutate({ minionId: minion.id });
  };

  const removeFromUserMutatiom = api.minion.removeFromUser.useMutation({
    onSuccess: async () => {
      alert('Removed from your collection!');
      await utils.minion.getAll.invalidate();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const removeFromUser = async () => {
    removeFromUserMutatiom.mutate({ minionId: minion.id });
  };

  return (
    <div className="rounded-xl border-4 border-stone-200 p-4 font-semibold transition duration-200 ease-in-out hover:scale-110 dark:border-stone-800">
      {minion.image && <Image src={minion.image} alt={minion.name} width={100} height={100} />}
      {minion.name}
      {session &&
        (minion.owners.find((o) => o.id === session.user.id) ? (
          <Button name="Remove" type="submit" disabled={!session} onClick={removeFromUser}>
            Remove
          </Button>
        ) : (
          <Button name="Add" type="submit" disabled={!session} onClick={addToUser}>
            Add
          </Button>
        ))}
    </div>
  );
}

export default function MinionList({ session }: { session: Session | null }) {
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
            <div className="grid grid-cols-5 gap-4" key={i}>
              {page.minions.map((minion, index) => (
                <div key={minion.id} ref={index === page.minions.length - 1 ? ref : undefined}>
                  <MinionCard minion={minion} session={session} />
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
