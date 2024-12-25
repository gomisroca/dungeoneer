import React, { useState } from 'react';
import Button from './ui/Button';
import { MdFilterList, MdFilterListOff } from 'react-icons/md';

function Filter({ onFilterChange }: { onFilterChange: (filter: boolean) => void }) {
  const [filter, setFilter] = useState(false);

  function handleFilterChange(filter: boolean) {
    onFilterChange(filter);
    setFilter(filter);
  }
  return (
    <div className="fixed right-12 top-1 z-20 flex flex-col items-end justify-end gap-2 p-4 md:right-20">
      <Button
        arialabel={filter ? 'Filter Off' : 'Filter'}
        name={filter ? 'Filter Off' : 'Filter'}
        onClick={() => handleFilterChange(!filter)}
        className="h-[32px] w-[32px] p-2 md:h-full md:w-fit md:p-3">
        <span className="sr-only">{filter ? 'Filter Off' : 'Filter'}</span>
        {filter ? <MdFilterListOff size={20} /> : <MdFilterList size={20} />}
      </Button>
    </div>
  );
}

export default Filter;
