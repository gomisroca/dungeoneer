'use client';

import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useState } from 'react';

export default function Search() {
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
    }
  }, [debouncedSearch, router]);

  return (
    <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
      <input
        className="w-full rounded-md bg-neutral-200 p-4 text-neutral-800 drop-shadow-md dark:bg-neutral-800 dark:text-neutral-200"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
      />
    </div>
  );
}
