'use client';

import InstanceCard from '@/app/_components/InstanceCard';
import useDebounce from '@/hooks/useDebounce';
import { type Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useEffect, useState } from 'react';
import { type ExpandedDungeon, type ExpandedRaid, type ExpandedTrial, type ExpandedVariantDungeon } from 'types';

interface SearchListProps {
  items: ExpandedDungeon[] | ExpandedRaid[] | ExpandedTrial[] | ExpandedVariantDungeon[];
  session: Session | null;
}
export default function SearchList({ items, session }: SearchListProps) {
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
      {!items || items.length === 0 ? (
        <p>No results were found 😞</p>
      ) : (
        items.map((item) => <InstanceCard key={item.id} instance={item} session={session} />)
      )}
    </div>
  );
}
