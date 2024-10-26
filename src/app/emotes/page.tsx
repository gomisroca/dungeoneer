import { getServerAuthSession } from '@/server/auth';
import { api } from '@/trpc/server';
import EmoteList from './EmoteList';

export default async function EmoteListWrapper() {
  const initialEmotes = await api.emotes.getAll({ limit: 15 });
  const session = await getServerAuthSession();
  return <EmoteList session={session} initialEmotes={initialEmotes} />;
}
