import { getServerAuthSession } from '@/server/auth';
import StyledLink from '../_components/ui/StyledLink';
import { MdOutlineSearch } from 'react-icons/md';
import LocalSyncSection from './LocalSyncSection';

function LodestoneSection() {
  return (
    <section>
      You can also look up a Lodestone character and sync their mount and minion collections.
      <StyledLink href="/sync/search" className="mx-auto w-64">
        <MdOutlineSearch size={20} />
        <p>Search the Lodestone</p>
      </StyledLink>
    </section>
  );
}

async function Sync() {
  const session = await getServerAuthSession();
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <LocalSyncSection session={session} />
      <LodestoneSection />
    </div>
  );
}

export default Sync;
