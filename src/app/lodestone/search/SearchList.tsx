import Image from 'next/image';
import { type LodestoneCharacter } from 'types';

interface LodestoneSearchListProps {
  characters: LodestoneCharacter[];
}
export default function LodestoneSearchList({ characters }: LodestoneSearchListProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      {!characters || characters.length === 0 ? (
        <p className="text-center">No characters were found 😞</p>
      ) : (
        characters.map((character) => (
          <div key={character.id}>
            <h1>{character.name}</h1>
            <Image src={character.avatar} alt={character.name} width={100} height={100} className="rounded-full" />
            <p>
              {character.server} - {character.data_center}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
