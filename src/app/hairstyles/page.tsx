import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import HairstyleList from './HairstyleList';

export default async function HairstyleListWrapper() {
  const initialHairstyles = await api.hairstyles.getAll({ limit: 15 });
  const session = await getServerAuthSession();
  return <HairstyleList session={session} initialHairstyles={initialHairstyles} />;
}
