'use client';

import Button from '@/app/_components/ui/Button';
import { DATA_CENTERS } from '@/utils/consts';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';
import { MdSearch } from 'react-icons/md';

function ServerSelect({
  selectedDataCenter,
  setSelectedDataCenter,
  setSelectedWorld,
}: {
  selectedDataCenter: string;
  setSelectedDataCenter: (dc: string) => void;
  setSelectedWorld: (world: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <select
        className="mx-auto w-64 rounded-md bg-zinc-200 p-4 drop-shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300 dark:bg-zinc-800 dark:focus-visible:ring-cyan-700"
        onChange={(e) => {
          setSelectedDataCenter(e.target.value);
          setSelectedWorld('');
        }}>
        <option value="">Select a data center</option>
        {Object.keys(DATA_CENTERS).map((dc) => (
          <option key={dc} value={dc}>
            {dc}
          </option>
        ))}
      </select>

      {selectedDataCenter && (
        <select
          className="mx-auto w-64 rounded-md bg-zinc-200 p-4 drop-shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300 dark:bg-zinc-800 dark:focus-visible:ring-cyan-700"
          onChange={(e) => setSelectedWorld(e.target.value)}>
          <option value="">Select a world</option>
          {(DATA_CENTERS[selectedDataCenter as keyof typeof DATA_CENTERS] || []).map((world) => (
            <option key={world} value={world}>
              {world}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function SearchBar() {
  const router = useRouter();

  // Variables to track the search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDataCenter, setSelectedDataCenter] = useState<string>('');
  const [selectedWorld, setSelectedWorld] = useState<string>('');

  // Handles the search term change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);
  };

  // Handles the search
  const handleSearch = async () => {
    if (searchTerm.trim().length > 0) {
      router.replace(`?name=${searchTerm}&dc=${selectedDataCenter}&server=${selectedWorld}&page=1`);
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 md:w-2/3 lg:w-1/2 xl:w-[400px]">
      <input
        className="mx-auto w-64 rounded-md bg-zinc-200 p-4 drop-shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300 dark:bg-zinc-800 dark:focus-visible:ring-cyan-700"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search..."
      />
      <ServerSelect
        selectedDataCenter={selectedDataCenter}
        setSelectedDataCenter={setSelectedDataCenter}
        setSelectedWorld={setSelectedWorld}
      />
      <Button onClick={handleSearch} disabled={searchTerm.trim().length === 0} className="mx-auto w-64">
        <MdSearch size={20} /> Search
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}

export default SearchBar;
