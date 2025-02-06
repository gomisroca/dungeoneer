import React, { useState } from 'react';
import Button from './ui/Button';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { MdFilterList } from 'react-icons/md';
import { useRouter, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

const EXPANSIONS = [
  {
    name: 'A Realm Reborn',
    value: 'arr',
  },
  {
    name: 'Heavensward',
    value: 'hw',
  },
  {
    name: 'Stormblood',
    value: 'sb',
  },
  {
    name: 'Shadowbringers',
    value: 'shb',
  },
  {
    name: 'Endwalker',
    value: 'ew',
  },
  {
    name: 'Dawntrail',
    value: 'dt',
  },
];

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

  const handleNavigate = async (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === selected) {
      params.delete('ex');
      router.push(`?${params.toString()}`);
    } else {
      params.set('ex', value);
      setSelected(value);
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <div
      data-testid="expandable-menu"
      className="mt-2 flex max-h-[600px] flex-col items-center justify-center gap-2 rounded-lg bg-zinc-200/75 p-2 dark:bg-zinc-800/75">
      <Button
        arialabel={filter ? 'Show Owned' : 'Hide Owned'}
        name={filter ? 'Show Owned' : 'Hide Owned'}
        onClick={() => handleFilterChange(!filter)}
        className="w-full">
        {filter ? (
          <>
            <IoMdEye size={20} /> <span>Show Owned</span>
          </>
        ) : (
          <>
            <IoMdEyeOff size={20} /> <span>Hide Owned</span>
          </>
        )}
      </Button>
      <span className="h-1 w-1/2 rounded-full bg-zinc-100/25 dark:bg-zinc-800/50"></span>
      {EXPANSIONS.map((expansion) => (
        <Button
          arialabel={expansion.name}
          key={expansion.value}
          onClick={() => handleNavigate(expansion.value)}
          className={twMerge('w-full', selected === expansion.value && 'bg-cyan-200 dark:bg-cyan-800')}>
          {expansion.name}
        </Button>
      ))}
    </div>
  );
}

function FilterMenu({ onFilterChange }: { onFilterChange: (filter: boolean) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [filter, setFilter] = useState(false);

  function handleFilterChange(newFilter: boolean) {
    onFilterChange(newFilter);
    setFilter(newFilter);
  }

  return (
    <div
      className="fixed right-12 top-1 z-20 m-4 flex flex-col items-end justify-end gap-2 md:right-20"
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}>
      <Button className="h-[32px] w-[32px] p-2 md:h-full md:w-fit md:p-3">
        <MdFilterList size={20} />
        <span className="sr-only">Filter Menu</span>
      </Button>
      {isExpanded && <ExpandedMenu filter={filter} handleFilterChange={handleFilterChange} />}
    </div>
  );
}

export default FilterMenu;
