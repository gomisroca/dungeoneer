import { type CardSource, type EmoteSource, type HairstyleSource, type MinionSource, type MountSource, type OrchestrionSource, type SpellSource } from 'generated/prisma';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

function Source({ source, compact = false }: { source: MinionSource | MountSource | OrchestrionSource | SpellSource | EmoteSource | HairstyleSource | CardSource; compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!triggerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div data-testid="source" className="flex flex-row gap-2">
      <TooltipProvider>
        <Tooltip open={isOpen}>
          <TooltipTrigger
            ref={(el) => { triggerRef.current = el; }}
            onClick={() => setIsOpen((prev) => !prev)}
            className="cursor-default">
            <Image
              src={`/sources/${source.type}.png`}
              alt={source.type}
              width={compact ? 30 : 50}
              height={compact ? 30 : 50}
              className={twMerge(
                'rounded-lg border-2 border-zinc-400 bg-zinc-400 object-contain transition duration-200 ease-in-out hover:scale-110 hover:border-cyan-300 hover:contrast-125 active:scale-110 active:contrast-125 active:duration-100 dark:border-zinc-600 dark:bg-zinc-600 dark:hover:border-cyan-700',
                compact ? 'h-9 w-9' : 'h-12 w-12'
              )}
            />
          </TooltipTrigger>
          {isOpen && (
            <div className="absolute z-50">
              <TooltipContent side="top" align="center" className="max-w-42.5 wrap-break-word p-2 text-sm sm:max-w-[320px]">
                <p>{source.text}</p>
              </TooltipContent>
            </div>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default Source;