import { type MinionSource, type MountSource, type OrchestrionSource, type EmoteSource, type HairstyleSource, type CardSource, SpellSource } from 'generated/prisma'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { useEffect, useRef, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { twMerge } from 'tailwind-merge';

function Source({ source, compact = false }: { source: MinionSource | MountSource | OrchestrionSource | SpellSource | EmoteSource | HairstyleSource | CardSource; compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animationParent] = useAutoAnimate()
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef && !triggerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleTriggerClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className='flex flex-row gap-2' ref={animationParent}>
      <TooltipProvider>
        <Tooltip open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <TooltipTrigger 
            ref={(el) => { triggerRef.current = el; }}
            onClick={handleTriggerClick}
            className='cursor-default'
          >
            <Image
              unoptimized
              src={`/sources/${source.type}.png`}
              alt={source.type}
              width={compact ? 30 : 50}
              height={compact ? 30 : 50}
              className={twMerge('active:scale-110 active:contrast-125 rounded-lg border-2 border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800/90 bg-zinc-200/90 hover:border-cyan-300 dark:hover:border-cyan-700 active:duration-100 hover:scale-110 transition duration-200 ease-in-out hover:contrast-125 object-contain', compact ? 'h-9 w-9' : 'h-12 w-12')}
            />
          </TooltipTrigger>
            {isOpen && (
              <div
                className='absolute z-50'
              >
                <TooltipContent
                  side="top"
                  align="center"
                  className="max-w-[170px] sm:max-w-[320px] break-words text-sm p-2"
                >
                  <p>{source.text}</p>
                </TooltipContent>
              </div>
            )}
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Source