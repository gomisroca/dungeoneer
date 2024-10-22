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
    className={twMerge('justify-center whitespace-nowrap hover:text-stone-900 active:duration-100 active:bg-cyan-300 active:scale-x-110 dark:active:bg-cyan-700 dark:hover:text-stone-100 text-nowrap ease-in-out rounded-xl backdrop-blur-md dark:hover:bg-cyan-700 p-4 font-semibold duration-200 transition hover:bg-cyan-300 flex flex-row gap-2 items-center', className, disabled && 'cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent')} disabled={disabled}>
      {children}
    </button>	
  )
}

Button.displayName = 'Button'

export default Button