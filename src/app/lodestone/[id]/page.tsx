import Button from '@/app/_components/ui/Button';
import { api } from '@/trpc/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function LodestoneWrapper({ params }: { params: Promise<{ id: string }> }) {
  const lodestoneId = (await params).id;
  if (!lodestoneId) return notFound();

  const character = await api.lodestone.character({
    lodestoneId: lodestoneId,
  });

  const handleSync = () => {
    // Sync the collection to the character's minions and mounts
  };

  return (
    <main>
      <h1>{character.name}</h1>
      <Image src={character.avatar} alt={character.name} width={100} height={100} className="rounded-full" />
      <p>
        {character.server} - {character.data_center}
      </p>
      <p>Total mounts: {character.total_mounts}</p>
      <p>Total minions: {character.total_minions}</p>
      <Button onClick={handleSync}>Sync</Button>
    </main>
  );
}
