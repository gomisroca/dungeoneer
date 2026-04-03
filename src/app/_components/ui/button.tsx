import { useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  arialabel?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void | Promise<void>;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button({ arialabel, type = 'button', disabled = false, onClick, className, children }: ButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const handleOnClick = useCallback(async () => {
    if (isPending || !onClick || disabled) return;
    try {
      setIsPending(true);
      await Promise.resolve(onClick());
    } catch (error) {
      console.error('Button onClick error:', error);
    } finally {
      if (isMounted.current) setIsPending(false);
    }
  }, [onClick, isPending, disabled]);

  return (
    <button
      aria-label={arialabel ?? 'button'}
      type={type}
      onClick={handleOnClick}
      disabled={disabled || isPending}
      className={twMerge(
        'flex cursor-pointer flex-row items-center justify-center gap-2 whitespace-nowrap rounded-md bg-zinc-200/50 p-4 font-semibold shadow-md transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-zinc-900 hover:drop-shadow-lg active:scale-x-110 active:bg-cyan-300 active:duration-100 dark:bg-zinc-800/50 dark:hover:bg-cyan-700 dark:hover:text-zinc-100 dark:active:bg-cyan-700',
        (disabled || isPending) && 'pointer-events-none cursor-not-allowed opacity-50 hover:bg-transparent active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent',
        className
      )}>
      {children}
    </button>
  );
}

Button.displayName = 'Button';