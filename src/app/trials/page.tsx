import { getServerAuthSession } from '@/server/auth';
import TrialList from './TrialList';
import { api } from '@/trpc/server';

export default async function TrialListWrapper() {
  const initialTrials = await api.trials.getAll({ limit: 30 });
  const session = await getServerAuthSession();
  return <TrialList session={session} initialTrials={initialTrials} />;
}
