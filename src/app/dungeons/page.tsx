import { getServerAuthSession } from '@/server/auth';
import DungeonList from './DungeonList';
import { api } from '@/trpc/server';

export default async function DungeonListWrapper() {
  const initialDungeons = await api.dungeons.getAll({ limit: 9 });
  const session = await getServerAuthSession();
  return <DungeonList session={session} initialDungeons={initialDungeons} />;
}
