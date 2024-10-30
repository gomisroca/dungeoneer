import SearchContent from './SearchContent';
import { getServerAuthSession } from '@/server/auth';

export default async function Search() {
  const session = await getServerAuthSession();
  return <SearchContent session={session} />;
}
