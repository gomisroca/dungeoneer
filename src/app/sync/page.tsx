import { MdOutlineSearch } from 'react-icons/md';

import Link from '@/app/_components/ui/link';
import LocalSync from '@/app/sync/local-sync';
import { auth } from '@/server/auth';

function LodestoneSync() {
  return (
    <section>
      You can also look up a Lodestone character and sync their mount and minion collections.
      <Link href="/sync/search" className="mx-auto w-64">
        <MdOutlineSearch size={20} />
        <p>Search the Lodestone</p>
      </Link>
    </section>
  );
}

async function Sync() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <LocalSync session={session} />
      <LodestoneSync />
    </div>
  );
}

export default Sync;
