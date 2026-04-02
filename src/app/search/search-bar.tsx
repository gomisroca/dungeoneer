'use client';

import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useState } from 'react';

import useDebounce from '@/hooks/useDebounce';

function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setIsTyping(true);
  };

  useEffect(() => {
    setIsTyping(false);
    if (debouncedSearch.trim().length > 0) {
      router.replace(`?q=${debouncedSearch}`);
    }
  }, [debouncedSearch, router]);

  return (
    <div className="w-full">
      <input
        className="w-full rounded-t-md bg-zinc-200 p-4 drop-shadow-md focus-visible:ring-1 focus-visible:ring-cyan-300 focus-visible:outline-none dark:bg-zinc-800 dark:focus-visible:ring-cyan-700"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
      />
      <div className="h-1 w-full rounded-b-md bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-1 rounded-b-md bg-cyan-300 transition-all duration-500 ease-out dark:bg-cyan-700 ${isTyping ? 'w-3/4' : 'w-0'}`}
        />
      </div>
    </div>
  );
}

export default SearchBar;
