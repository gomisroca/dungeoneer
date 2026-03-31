'use client';

import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import { messageAtom } from '@/atoms/message';

const Message = () => {
  const [message, setMessage] = useAtom(messageAtom);
  const pathname = usePathname();

  useEffect(() => {
    if (message) setMessage(null);
  }, [pathname]);

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timeout);
  }, [message]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <div className={twMerge(
        'rounded-md border-2 border-zinc-400 bg-zinc-200/90 px-3 py-1.5 text-sm shadow-lg dark:border-zinc-600 dark:bg-zinc-800/90',
        message.type === 'error' && 'border-red-500 dark:border-red-600',
        message.type === 'success' && 'border-green-500 dark:border-green-600',
        message.type === 'warning' && 'border-yellow-500 dark:border-yellow-600',
      )}>
        {message.content}
      </div>
    </div>
  );
};

export default Message;