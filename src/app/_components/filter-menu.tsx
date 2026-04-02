import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { MdFilterList } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

import Button from '@/app/_components/ui/button';
import { EXPANSIONS } from '@/utils/consts';

const EXPANSION_LIST = Object.entries(EXPANSIONS).map(([value, patch]) => ({
  value,
  patch,
  name:
    {
      arr: 'A Realm Reborn',
      hw: 'Heavensward',
      sb: 'Stormblood',
      shb: 'Shadowbringers',
      ew: 'Endwalker',
      dt: 'Dawntrail',
    }[value] ?? value,
}));

export function ExpandedMenu({
  filter,
  handleFilterChange,
}: {
  filter: boolean;
  handleFilterChange: (filter: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get('ex') ?? 'all');

  const handleNavigate = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === selected) {
      params.delete('ex');
      setSelected('all');
    } else {
      params.set('ex', value);
      setSelected(value);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div
      data-testid="expandable-menu"
      className="mt-2 flex max-h-96 flex-col items-center justify-center gap-2 overflow-y-auto rounded-md bg-zinc-200/75 p-2 dark:bg-zinc-800/75">
      <Button
        arialabel={filter ? 'Show Owned' : 'Hide Owned'}
        onClick={() => handleFilterChange(!filter)}
        className="w-full">
        {filter ? (
          <>
            <IoMdEye size={20} />
            <span>Show Owned</span>
          </>
        ) : (
          <>
            <IoMdEyeOff size={20} />
            <span>Hide Owned</span>
          </>
        )}
      </Button>
      <span className="h-1 w-1/2 rounded-full bg-zinc-100/25 dark:bg-zinc-800/50" />
      {EXPANSION_LIST.map((expansion) => (
        <Button
          key={expansion.value}
          arialabel={expansion.name}
          onClick={() => handleNavigate(expansion.value)}
          className={twMerge('w-full', selected === expansion.value && 'bg-cyan-200 dark:bg-cyan-800')}>
          {expansion.name}
        </Button>
      ))}
    </div>
  );
}

function FilterMenu({ filter, onFilterChange }: { filter: boolean; onFilterChange: (filter: boolean) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-1 right-12 z-20 m-4 flex flex-col items-end justify-end gap-2 md:right-20">
      <Button
        className="h-8 w-8 p-2 md:h-full md:w-fit md:p-3"
        arialabel="Filter Menu"
        onClick={() => setIsExpanded((prev) => !prev)}>
        <MdFilterList size={20} />
        <span className="sr-only">Filter Menu</span>
      </Button>
      {isExpanded && <ExpandedMenu filter={filter} handleFilterChange={onFilterChange} />}
    </div>
  );
}

export default FilterMenu;
