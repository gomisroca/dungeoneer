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
    <div
      className="fixed top-4 right-4 z-50 space-y-2 flex flex-col items-end self-end justify-self-end rounded-md">
      <div className={twMerge(
        ':text-2xl flex w-full items-center justify-center shadow-lg rounded-md border-2 border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800/90 bg-zinc-200/90 px-3 py-1.5 text-sm', 
        message?.error && 'border-red-500 dark:border-red-600')}>
        {message?.content ?? 'No message.'}
      </div>
    </div>
  );
};

export default Message;
