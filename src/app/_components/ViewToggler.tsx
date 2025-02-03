import Button from '@/app/_components/ui/Button';
import React, { useState } from 'react';
import { LuExpand, LuShrink } from 'react-icons/lu';

function ViewToggler({ onViewChange }: { onViewChange: (view: boolean) => void }) {
  const [view, setView] = useState(false);

  function handleViewChange(view: boolean) {
    onViewChange(view);
    setView(view);
  }
  return (
    <div className="fixed right-20 top-1 z-20 flex flex-col items-end justify-end gap-2 p-4 md:right-32">
      <Button onClick={() => handleViewChange(!view)} className="h-[32px] w-[32px] p-2 md:h-full md:w-fit md:p-3">
        <span className="sr-only">{view ? 'Compact View' : 'Compact View Off'}</span>
        {view ? <LuShrink size={20} /> : <LuExpand size={20} />}
      </Button>
    </div>
  );
}

export default ViewToggler;
