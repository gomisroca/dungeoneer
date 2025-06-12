/**
 * Button component that displays a button with a specified name and optional className.
 *
 * @param {{ name: string; type?: "button" | "submit" | "reset"; onClick?: () => void; className?: string; children: React.ReactNode; disabled?: boolean; }} props - The props for the Button component.
 *
 * @example
 * <Button name="Submit" onClick={handleSubmit}>
 *   Submit
 * </Button>
 */

import React, { useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  name?: string
  arialabel?: string;
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button({ name, arialabel, type = 'button', disabled = false, onClick, className, children }: ButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleOnClick = useCallback(async () => {
    if (isPending || !onClick || disabled) return;
    try{
      setIsPending(true);
      await Promise.resolve(onClick());
      setTimeout(() =>  console.log('timeout'), 5000);
    } catch(error) {
      console.log(error);
    } finally {
      console.log('finally');
      setIsPending(false);
    }
  }, [onClick]);

  return (
    <button 
    aria-label={arialabel || 'button'}
    name={name || 'Button'}
    type={type} 
    onClick={handleOnClick} 
    className={twMerge('justify-center whitespace-nowrap shadow-md hover:drop-shadow-lg dark:bg-zinc-800/50 bg-zinc-200/50 hover:text-zinc-900 active:duration-100 active:bg-cyan-300 active:scale-x-110 dark:active:bg-cyan-700 dark:hover:text-zinc-100 text-nowrap ease-in-out rounded-xl dark:hover:bg-cyan-700 p-4 font-semibold duration-200 transition hover:bg-cyan-300 flex flex-row gap-2 items-center cursor-pointer', 
      className,  
      (disabled || isPending) && 'opacity-50 cursor-not-allowed pointer-events-none hover:bg-none active:bg-none dark:hover:bg-none dark:active:bg-none')} 
    disabled={disabled || isPending}>
      {children}
    </button>	
  )
}

Button.displayName = 'Button'