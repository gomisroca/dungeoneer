import { getServerAuthSession } from '@/server/auth';
import MinionList from './MinionList';

export default async function MinionListWrapper() {
  const session = await getServerAuthSession();
  return <MinionList session={session} />;
}
