'use client';

/**
 * Renders a search bar component.
 *
 * @example
 * <SearchBar />
 */

import { type ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LuSearch } from 'react-icons/lu';
import useDebounce from '@/hooks/useDebounce';
import Button from '../ui/Button';

const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Variables to track the search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearch = useDebounce(searchTerm, 1000);

  // Handles the search term change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm.toLowerCase());
  };

  // Handles the search when the debounced search term changes
  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      router.push(`/search/${debouncedSearch}`);
      setSearchTerm('');
      setOpen(false);
    }
  }, [debouncedSearch, router]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <Button className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4" onClick={() => setOpen(!open)}>
        <LuSearch size={20} />
      </Button>
      {open && (
        <div className="absolute right-5 z-[999] px-4 py-2 md:right-9">
          <input
            className="rounded-md bg-neutral-200 p-4 text-neutral-800 drop-shadow-md dark:bg-neutral-800 dark:text-neutral-200"
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search..."
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
