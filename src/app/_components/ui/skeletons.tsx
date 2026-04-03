import { twMerge } from 'tailwind-merge';

export const ItemCardSkeleton = ({ owned = false }) => {
  return (
    <div
      data-testid="item-card-skeleton"
      className={twMerge(
        'relative flex h-96 min-w-64 animate-pulse flex-col items-center justify-between gap-y-4 rounded-md border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-50 hover:scale-125 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700',
        owned && 'opacity-50 hover:opacity-100'
      )}>
      {owned && (
        <div className="absolute -right-4 -top-4 flex contrast-200">
          <div className="h-6 w-6 rounded-full bg-cyan-300 dark:bg-cyan-700" />
        </div>
      )}
      <div className="flex w-32 flex-col items-center justify-center gap-y-2">
        <div className="h-24 w-24 rounded-md bg-zinc-200 dark:bg-zinc-900" />
        <div className="mx-auto mb-1 h-10 w-32 rounded bg-zinc-200 dark:bg-zinc-900" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 md:p-2">
        <div className="h-12 w-12 rounded bg-zinc-200 dark:bg-zinc-900" />
      </div>
      <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-900" />
    </div>
  );
};

export const CollectibleListItemSkeleton = ({ owned = false }) => {
  return (
    <div
      data-testid="item-list-skeleton"
      className={twMerge(
        'relative flex h-full min-w-52 animate-pulse items-center justify-between border-l border-zinc-200 p-4 font-semibold shadow-md transition duration-200 ease-in hover:shadow-2xl dark:border-zinc-800',
        owned && 'opacity-50 hover:opacity-100'
      )}>
      {owned && (
        <div className="absolute -right-4 -top-4 flex contrast-200">
          <div className="h-6 w-6 rounded-full bg-cyan-300 dark:bg-cyan-700" />
        </div>
      )}
      <div className="flex w-32 flex-col items-center justify-center gap-y-2">
        <div className="h-12 w-12 rounded-md bg-zinc-300 dark:bg-zinc-700" />
        <div className="min-h-[calc(2*1.625rem)] w-full">
          <div className="mx-auto mb-1 h-4 w-3/4 rounded bg-zinc-300 dark:bg-zinc-700" />
          <div className="mx-auto h-4 w-1/2 rounded bg-zinc-300 dark:bg-zinc-700" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 md:p-2">
        <div className="h-8 w-8 rounded bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="h-12 w-16 rounded bg-zinc-300 dark:bg-zinc-700" />
    </div>
  );
};

export const InstanceCardSkeleton = () => {
  return (
    <div
      data-testid="instance-card-skeleton"
      className="relative flex h-96 min-w-64 animate-pulse flex-col items-center justify-start gap-y-4 rounded-md border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-50 hover:scale-125 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700">
      <div className="flex w-full flex-col items-center justify-center gap-y-2">
        <div className="h-24 w-full rounded-md bg-zinc-200 dark:bg-zinc-900" />
        <div className="mx-auto mb-1 h-10 w-32 rounded bg-zinc-200 dark:bg-zinc-900" />
        <div className="mx-auto mb-1 h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-900" />
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-1 md:gap-2">
        <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-900" />
        <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-900" />
      </div>
    </div>
  );
};

export const InstanceListItemSkeleton = () => {
  return (
    <div
      data-testid="instance-list-skeleton"
      className="relative flex h-full w-full animate-pulse items-center justify-between gap-10 border-l border-zinc-200 p-4 font-semibold shadow-md transition duration-200 ease-in hover:shadow-2xl dark:border-zinc-800 md:min-w-80 lg:min-w-96">
      <div className="flex w-40 flex-col items-center justify-center gap-y-2">
        <div className="mx-auto mb-1 h-10 w-full rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="mx-auto h-4 w-1/2 rounded bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 md:p-2">
        <div className="h-8 w-32 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-8 w-20 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-8 w-28 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-8 w-20 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-8 w-16 rounded bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
};