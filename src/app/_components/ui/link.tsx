import NextLink from 'next/link';
import { twMerge } from 'tailwind-merge';

function Link({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
  return (
    <NextLink
      href={href}
      className={twMerge(
        'flex cursor-pointer flex-row items-center justify-center gap-2 whitespace-nowrap rounded-md bg-zinc-200/50 p-4 font-semibold shadow-md transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-zinc-900 hover:drop-shadow-lg active:scale-x-110 active:bg-cyan-300 active:duration-100 dark:bg-zinc-800/50 dark:hover:bg-cyan-700 dark:hover:text-zinc-100 dark:active:bg-cyan-700',
        className
      )}>
      {children}
    </NextLink>
  );
}

export default Link;