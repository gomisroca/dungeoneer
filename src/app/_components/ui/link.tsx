import React from 'react'
import NextLink from 'next/link';
import { twMerge } from 'tailwind-merge';

function Link({ children, href, className }: { children: React.ReactNode, href: string, className?: string }) {
  return (
    <NextLink
    href={href}
    className={twMerge("flex flex-row items-center dark:bg-zinc-800/50 bg-zinc-100/25 justify-center gap-2 whitespace-nowrap text-nowrap rounded-xl p-4 font-semibold transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-zinc-900 active:scale-x-110 active:bg-cyan-300 active:duration-100 dark:hover:bg-cyan-700 dark:hover:text-zinc-100 dark:active:bg-cyan-700", className)}>
      {children}
    </NextLink>
  )
}

export default Link