import Image from 'next/image';
import { type LodestoneCharacter } from 'types';

import Link from '@/app/_components/ui/link';

interface LodestoneSearchListProps {
  characters: LodestoneCharacter[];
}

export default async function LodestoneSearchList({ characters }: LodestoneSearchListProps) {
  if (!characters || characters.length === 0) return <p className="text-center">No characters were found 😞</p>;
  return (
    <div className="flex w-full flex-1 flex-wrap justify-center gap-4">
      {characters.map((character) => (
        <Link
          key={character.id}
          href={`/sync/character/${character.id}`}
          className="flex h-fit w-64 flex-col items-center justify-center gap-y-2">
          <Image src={character.avatar} alt={character.name} width={100} height={100} className="rounded-full" />
          <h1 className="text-2xl font-bold">{character.name}</h1>
          <p className="text-sm">
            {character.server} - {character.data_center}
          </p>
        </Link>
      ))}
    </div>
  );
}
