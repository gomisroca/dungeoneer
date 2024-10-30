import InstanceCard from '@/app/_components/InstanceCard';
import { type Session } from 'next-auth';
import { type ExpandedDungeon, type ExpandedRaid, type ExpandedTrial, type ExpandedVariantDungeon } from 'types';

interface SearchListProps {
  items: ExpandedDungeon[] | ExpandedRaid[] | ExpandedTrial[] | ExpandedVariantDungeon[];
  session: Session | null;
}

export default function SearchList({ items, session }: SearchListProps) {
  return (
    <div className="w-full">
      {!items || items.length === 0 ? (
        <p>No results were found 😞</p>
      ) : (
        items.map((item) => <InstanceCard key={item.id} instance={item} session={session} />)
      )}
    </div>
  );
}
