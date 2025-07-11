import React, { useState } from 'react';
import { LuExpand, LuShrink } from 'react-icons/lu';

import Button from '@/app/_components/ui/button';

function ViewToggler({ onViewChange }: { onViewChange: (view: boolean) => void }) {
  const [view, setView] = useState(false);

  function handleViewChange() {
    setView((prev) => !prev);
    onViewChange(!view);
  }

  return (
    <div className="fixed top-1 right-[5.5rem] z-20 flex flex-col items-end justify-end gap-2 p-4 md:right-[8.5rem]">
      <Button
        onClick={() => handleViewChange()}
        className="h-[32px] w-[32px] p-2 md:h-full md:w-fit md:p-3"
        arialabel={view ? 'Compact View' : 'Compact View Off'}>
        {view ? <LuShrink size={20} /> : <LuExpand size={20} />}
      </Button>
    </div>
  );
}

export default ViewToggler;
