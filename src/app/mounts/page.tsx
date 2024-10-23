import { getServerAuthSession } from '@/server/auth';
import MountList from './MountList';
import { api } from '@/trpc/server';

export default async function MountListWrapper() {
  const initialMounts = await api.mounts.getAll({ limit: 15 });
  const session = await getServerAuthSession();
  return <MountList session={session} initialMounts={initialMounts} />;
}
