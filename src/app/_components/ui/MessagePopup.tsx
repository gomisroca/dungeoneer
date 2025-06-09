'use client';

/**
 * Display a message to the user, with an optional error state. Uses jotai's atoms to store the message.
 *
 * @example
 * setMessage({ content: 'Hello, world!', error: false })
 */

import { messageAtom } from '@/atoms/message';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

const Message = () => {
  const [message, setMessage] = useAtom(messageAtom); // Hook to get and set the message atom

  const pathname = usePathname(); // Get the current path

  // Clear message and error on route change
  useEffect(() => {
    if (message) {
      setMessage(null);
    }
  }, [pathname]);

  // Automatically hide popup after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage(null);
    }, 5000);

    // Cleanup timeout when popup state changes
    return () => clearTimeout(timeout);
  }, [message]);

  if (!message) return null;

  return (
    <dialog
      className={twMerge(
        'fixed right-0 bottom-10 left-0 z-[9999] m-auto flex w-[90vw] skew-x-2 skew-y-1 flex-col items-center justify-center gap-2 bg-black p-2 font-semibold text-zinc-50 transition duration-200 ease-in-out md:w-2/3 xl:w-[30vw] dark:bg-white dark:text-zinc-200',
        message?.error && 'bg-red-500 dark:bg-red-600'
      )}>
      <div className=":text-2xl flex w-full skew-x-2 skew-y-[0.5deg] items-center justify-center bg-sky-500 p-2 md:text-lg dark:bg-sky-600">
        {message?.content ?? 'hello'}
      </div>
    </dialog>
  );
};

export default Message;
