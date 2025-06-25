import { twMerge } from "tailwind-merge";

export const ItemCardSkeleton = ({ owned = false}) => {
    return (
        <div
        data-testid="item-card-skeleton"
      className={twMerge(
        'relative flex  min-w-[255px] h-[375px] flex-col items-center justify-between gap-y-4 animate-pulse rounded-md border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:scale-125 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700',
        owned && 'opacity-50 hover:opacity-100'
      )}>
        {owned && (
        <div className="absolute top-[-15px] right-[-15px] flex contrast-200">
          <div className="h-6 w-6 rounded-full bg-cyan-300 dark:bg-cyan-700" />
        </div>
      )}
      <div className="flex w-[125px] flex-col items-center justify-center gap-y-2">
        <div className="h-[100px] w-[100px] rounded-md bg-zinc-200 dark:bg-zinc-900" />
          <div className="mb-1 h-10 w-[125px] mx-auto rounded bg-zinc-200 dark:bg-zinc-900" />
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 md:p-2">
        <div className="h-12 w-12 rounded bg-zinc-200 dark:bg-zinc-900" />
      </div>
     
      <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-900" />
    </div>
    )
}

export const CollectibleListItemSkeleton = ({ owned = false }) => {
  return (
    <div
      data-testid="item-list-skeleton"
      className={twMerge(
        'relative flex h-full items-center justify-between min-w-[200px] border-l border-zinc-200 p-4 font-semibold shadow-md transition duration-200 ease-in hover:shadow-2xl dark:border-zinc-800 animate-pulse',
        owned && 'opacity-50 hover:opacity-100'
      )}
    >
      {owned && (
        <div className="absolute top-[-15px] right-[-15px] flex contrast-200">
          <div className="h-6 w-6 rounded-full bg-cyan-300 dark:bg-cyan-700" />
        </div>
      )}

      <div className="flex w-[125px] flex-col items-center justify-center gap-y-2">
        <div className="h-[50px] w-[50px] rounded-md bg-zinc-300 dark:bg-zinc-700" />
        <div className="min-h-[calc(2*1.625rem)] w-full">
          <div className="mb-1 h-4 w-3/4 mx-auto rounded bg-zinc-300 dark:bg-zinc-700" />
          <div className="h-4 w-1/2 mx-auto rounded bg-zinc-300 dark:bg-zinc-700" />
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
      className='relative flex  min-w-[255px] h-[375px] flex-col items-center justify-start gap-y-4 animate-pulse rounded-md border-4 border-zinc-200 bg-zinc-300 p-4 font-semibold shadow-md transition duration-200 ease-in hover:z-[99] hover:scale-125 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-700'>
        <div className="flex w-full flex-col items-center justify-center gap-y-2">
          <div className="h-[100px] w-full rounded-md bg-zinc-200 dark:bg-zinc-900" />
          <div className="mb-1 h-10 w-[125px] mx-auto rounded bg-zinc-200 dark:bg-zinc-900" />
          <div className="mb-1 h-4 w-[125px] mx-auto rounded bg-zinc-200 dark:bg-zinc-900" />
        </div>
      
        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 w-full">
          <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-900" />
          <div className="h-12 w-full rounded bg-zinc-200 dark:bg-zinc-900" />
        </div>
      </div>
    )
}

export const InstanceListItemSkeleton = () => {
  return (
    <div 
    data-testid="instance-list-skeleton"
    className='relative flex h-full w-full items-center justify-between md:min-w-[300px] lg:min-w-[400px] border-l border-zinc-200 gap-10 p-4 font-semibold shadow-md transition duration-200 ease-in hover:shadow-2xl dark:border-zinc-800 animate-pulse'>
  
      <div className="flex w-[150px] flex-col items-center justify-center gap-y-2">
          <div className="mb-1 h-10 w-full mx-auto rounded bg-zinc-300 dark:bg-zinc-700" />
          <div className="h-4 w-1/2 mx-auto rounded bg-zinc-300 dark:bg-zinc-700" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 md:p-2">
        <div className="h-8 w-30 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-8 w-20 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-8 w-28 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-8 w-20 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-8 w-18 rounded bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
};