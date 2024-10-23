import { getServerAuthSession } from '@/server/auth';
import RaidList from './RaidList';
import { api } from '@/trpc/server';

export default async function RaidListWrapper() {
  const initialRaids = await api.raids.getAll({ limit: 30 });
  const session = await getServerAuthSession();
  return <RaidList session={session} initialRaids={initialRaids} />;
}
