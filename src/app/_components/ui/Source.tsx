import { type Source as SourceType } from '@prisma/client'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'
import { useSignal, useSignalEffect } from '@preact-signals/safe-react'
import { AnimatePresence, motion } from 'framer-motion';

function Source({ source }: { source: SourceType }) {
  const isOpen = useSignal(false);
  const triggerRef = useSignal<HTMLButtonElement | null>(null);

  useSignalEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.value && !triggerRef.value.contains(event.target as Node)) {
        isOpen.value = false
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleTriggerClick = () => {
    isOpen.value = !isOpen.value
  }

  return (
    <div className='flex flex-row gap-2'>
      <TooltipProvider>
        <Tooltip open={isOpen.value} onOpenChange={() => isOpen.value = !isOpen.value}>
          <TooltipTrigger 
            ref={(el) => { triggerRef.value = el; }}
            onClick={handleTriggerClick}
            className='cursor-default'
          >
            <Image
              src={`/sources/${source.type}.png`}
              alt={source.type}
              width={50}
              height={50}
              className='active:scale-110 active:contrast-125 active:duration-100 hover:scale-110 transition duration-200 ease-in-out hover:contrast-125 h-12 object-contain'
            />
          </TooltipTrigger>
          <AnimatePresence mode="wait">
            {isOpen.value && (
              <motion.div
                className='absolute z-50'
                key="tooltip-content"
                initial={{ opacity: 0, y: 0, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 0, scale: 0, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <TooltipContent
                  side="top"
                  align="center"
                  className="max-w-[170px] sm:max-w-[320px] break-words text-sm p-2"
                >
                  <p>{source.text}</p>
                </TooltipContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Source