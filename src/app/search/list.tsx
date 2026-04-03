import { type Session } from 'next-auth';
import { type ExpandedInstance } from 'types';

import { InstanceCard } from '@/app/_components/ui/cards';

export default function SearchList({ items, session }: { items: ExpandedInstance[]; session: Session | null }) {
  if (items.length === 0) return <p className="text-center">No results were found 😞</p>;

  return (
    <div className="flex w-full flex-col gap-4">
      {items.map((item) => (
        <InstanceCard key={item.id} instance={item} session={session} />
      ))}
    </div>
  );
}
