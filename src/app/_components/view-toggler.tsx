import { useState } from 'react';
import { LuExpand, LuShrink } from 'react-icons/lu';

import Button from '@/app/_components/ui/button';

function ViewToggler({ onViewChange }: { onViewChange: (view: boolean) => void }) {
  const [compact, setCompact] = useState(false);

  function handleViewChange() {
    setCompact((prev) => {
      onViewChange(!prev);
      return !prev;
    });
  }

  return (
    <div className="fixed top-1 right-24 z-20 flex flex-col items-end justify-end gap-2 p-4 md:right-36">
      <Button
        onClick={handleViewChange}
        className="h-8 w-8 p-2 md:h-full md:w-fit md:p-3"
        arialabel={compact ? 'Compact View On' : 'Compact View Off'}>
        {compact ? <LuShrink size={20} /> : <LuExpand size={20} />}
      </Button>
    </div>
  );
}

export default ViewToggler;
