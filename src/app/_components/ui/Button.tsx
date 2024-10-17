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

import React from 'react'
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  name?: string
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function Button({ name, type = 'button', disabled = false, onClick, className, children }: ButtonProps) {
  return (
    <button 
    aria-label={name || 'button'}
    name={name || 'Button'}
    type={type} 
    onClick={onClick} 
    className={twMerge('justify-center whitespace-nowrap text-nowrap border dark:border-neutral-400/10 duration-200 ease-in-out border-neutral-600/10 rounded-full bg-neutral-200/95 dark:bg-neutral-800/95 backdrop-blur-sm xl:bg-neutral-200/80 xl:dark:bg-neutral-800/80  dark:shadow-neutral-500/10 dark:hover:bg-neutral-700/80 px-10 py-3 shadow-md font-semibold transition hover:bg-neutral-300/80 flex flex-row gap-2 items-center', className, disabled && 'cursor-not-allowed')} disabled={disabled}>
      {children}
    </button>	
  )
}

Button.displayName = 'Button'

export default Button