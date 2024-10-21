import { type Source } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip'

function Source({ source } : { source: Source }) {
  return (
    <div className='flex flex-row gap-2'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className='cursor-default'>
            <Image src={`/sources/${source.type}.png`} alt={source.type} width={50} height={50}  className='hover:scale-110 transition duration-200 ease-in-out  hover:contrast-125'/>
          </TooltipTrigger>
          <TooltipContent>
          <p>{source.text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Source