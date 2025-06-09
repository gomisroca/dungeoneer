import SearchContent from './SearchContent';
import { auth } from '@/server/auth';

export default async function Search() {
  const session = await auth();
  return <SearchContent session={session} />;
}
