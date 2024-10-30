'use client';

import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

function SearchBar() {
  const router = useRouter();

  // Variables to track the search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const startProgressBar = () => {
    const intervalTime = 25;
    const incrementAmount = (intervalTime / 500) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 100;
        }
        return Math.min(prevProgress + incrementAmount, 100);
      });
    }, intervalTime);
  };

  // Handles the search term change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    startProgressBar();
  };

  // Handles the search when the debounced search term changes
  useEffect(() => {
    if (debouncedSearch.trim().length > 0) {
      router.replace(`?q=${debouncedSearch}`);
      setSearchTerm('');
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  }, [debouncedSearch, router]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full">
      <input
        className="w-full rounded-t-md bg-zinc-200 p-4 drop-shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300 dark:bg-zinc-800 dark:focus-visible:ring-cyan-700"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search..."
      />
      <div className="h-1 w-full rounded-b-md bg-zinc-200 dark:bg-zinc-700">
        <div
          className="duration-50 h-1 rounded-b-md bg-cyan-300 transition-all ease-out dark:bg-cyan-700"
          style={{ width: `${progress}%` }}></div>
      </div>
      {progress > 80 && <p className="text-center">Searching...</p>}
    </div>
  );
}

export default SearchBar;
