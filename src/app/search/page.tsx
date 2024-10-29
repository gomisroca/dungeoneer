'use client';

import useDebounce from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

export default function Search() {
  const router = useRouter();

  // Variables to track the search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 2500);

  const startProgressBar = () => {
    const intervalTime = 25;
    const incrementAmount = (intervalTime / 2000) * 100;

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
      router.push(`/search/${debouncedSearch}`);
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
    <div className="flex min-h-[80vh] w-5/6 flex-col items-center justify-start gap-4 p-4 md:w-2/3 lg:w-1/2 xl:w-[400px]">
      <div className="w-full">
        <input
          className="w-full rounded-t-md bg-neutral-200 p-4 text-neutral-800 drop-shadow-md dark:bg-neutral-800 dark:text-neutral-200"
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search..."
        />
        <div className="h-1 w-full rounded-b-md bg-gray-200 dark:bg-gray-700">
          <div
            className="duration-50 h-1 rounded-b-md bg-blue-600 transition-all ease-out dark:bg-blue-500"
            style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}
