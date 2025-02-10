import { api } from '@/trpc/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import SyncButton from './SyncButton';
import { getServerAuthSession } from '@/server/auth';

interface ProgressBarProps {
  count: number;
  total: number;
}

function ProgressBar({ count, total }: ProgressBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="relative h-4 w-full rounded-md bg-zinc-100/25 dark:bg-zinc-800/50">
      <div className="h-4 rounded-md bg-cyan-300 dark:bg-cyan-700" style={{ width: `${percentage}%` }} />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {count} / {total}
      </span>
    </div>
  );
}

export default async function LodestoneWrapper({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerAuthSession();
  const lodestoneId = (await params).id;
  if (!lodestoneId) return notFound();

  const character = await api.lodestone.character({
    lodestoneId: lodestoneId,
  });

  return (
    <main className="flex min-w-96 flex-col items-center justify-center gap-y-10 rounded-xl bg-zinc-200/20 p-10 dark:bg-zinc-900/20">
      <section className="flex flex-col items-center justify-center">
        <Image src={character.avatar} alt={character.name} width={100} height={100} className="rounded-full" />
        <h1 className="text-2xl font-bold">{character.name}</h1>
        <p className="text-sm">
          {character.server} - {character.data_center}
        </p>
      </section>
      {!character.minions.public ? (
        <p>This character&apos;s minion collection is not public.</p>
      ) : (
        <div className="w-full">
          <p className="text-xs uppercase">Minions</p>
          <ProgressBar count={character.minions.count} total={character.minions.total} />
        </div>
      )}
      {!character.mounts.public ? (
        <p>This character&apos;s mount collection is not public.</p>
      ) : (
        <div className="w-full">
          <p className="text-xs uppercase">Mounts</p>
          <ProgressBar count={character.mounts.count} total={character.mounts.total} />
        </div>
      )}
      <SyncButton session={session} lodestoneId={lodestoneId} />
    </main>
  );
}
