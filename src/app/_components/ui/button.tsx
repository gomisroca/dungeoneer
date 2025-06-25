/**
 * Button component that displays a button with a specified name and optional className.
 *
 * @param {{ name: string; type?: "button" | "submit" | "reset"; onClick?: () => void; className?: string; children: React.ReactNode; disabled?: boolean; }} props - The props for the Button component.
 *
 * @example
 * <Button arialabel="Submit" onClick={handleSubmit}>
 *   Submit
 * </Button>
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  arialabel?: string;
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button({ arialabel, type = 'button', disabled = false, onClick, className, children }: ButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleOnClick = useCallback(async () => {
    if (isPending || !onClick || disabled) return;
    try{
      setIsPending(true);
      await Promise.resolve(onClick());
    } catch(error) {
      console.error('Button onClick error:', error);
    } finally {
      if (isMounted.current) {
        setIsPending(false);
      }
    }
  }, [onClick, isPending, disabled]);

  return (
    <button 
    aria-label={arialabel || 'button'}
    type={type}
    onClick={handleOnClick} 
    className={twMerge('justify-center whitespace-nowrap shadow-md hover:drop-shadow-lg dark:bg-zinc-800/50 bg-zinc-200/50 hover:text-zinc-900 active:duration-100 active:bg-cyan-300 active:scale-x-110 dark:active:bg-cyan-700 dark:hover:text-zinc-100 text-nowrap ease-in-out rounded-md dark:hover:bg-cyan-700 p-4 font-semibold duration-200 transition hover:bg-cyan-300 flex flex-row gap-2 items-center cursor-pointer', 
      className,  
      (disabled || isPending) && 'opacity-50 cursor-not-allowed pointer-events-none hover:bg-none active:bg-none dark:hover:bg-none dark:active:bg-none')} 
    disabled={disabled || isPending}>
      {children}
    </button>	
  )
}

Button.displayName = 'Button'